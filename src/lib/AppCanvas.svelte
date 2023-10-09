<script lang="ts">
  import { onMount } from "svelte";
  import {
    getRandomNumberInRange,
    isTwoCirclesColliding,
    randomColor,
  } from "../helpers/functions";

  import { Circle, Enemy, MovingCircle, Projectile } from "../models/models";
  import Modal from "./components/modal/modal.svelte";

  const enemies: Enemy[] = [];
  const projectiles: Projectile[] = [];
  const explosionCircles: MovingCircle[] = [];
  let playerScore = 0;
  let animateFrameID = 0;
  let animating = false;
  let gameover = false;

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | undefined;

  function resizeCanvas() {
    endAnimation();
    if (!ctx) return;
    const canvas = ctx.canvas;
    canvas.height = innerHeight;
    canvas.width = innerWidth;
  }

  function shootProjectile(e: MouseEvent) {
    if (!ctx) return;
    const canvas = ctx.canvas;
    const mouse = {
      x: e.x,
      y: e.y,
    };

    const playerPosition = {
      x: canvas.width / 2,
      y: canvas.height / 2,
    };

    const angle = Math.atan2(
      mouse.y - playerPosition.y,
      mouse.x - playerPosition.x
    );

    const speedFactor = 8;

    const velocity = {
      x: Math.cos(angle) * speedFactor,
      y: Math.sin(angle) * speedFactor,
    };
    const newProjectile = new Projectile(
      ctx,
      playerPosition.x,
      playerPosition.y,
      6,
      "crimson",
      velocity.x,
      velocity.y
    );

    projectiles.push(newProjectile);
  }

  function removeEnemy(index: number) {
    enemies.splice(index, 1);
  }

  function shrinkEnemy(enemy: Enemy) {
    enemy.radius *= 0.5;
  }

  function spawnEnemies() {
    if (!ctx) return;
    const canvas = ctx.canvas;
    const numberOfEnemiesToSpawn = 1;
    for (let i = 0; i < numberOfEnemiesToSpawn; i++) {
      const enemyPosition = {
        x: getRandomNumberInRange(-canvas.width, canvas.width * 2),
        y:
          Math.random() > 0.5
            ? getRandomNumberInRange(-100, 0)
            : getRandomNumberInRange(canvas.height, canvas.height + 100),
      };

      // NEED TO FIND THE ANGLE FROM ENEMY TO PLAYER SO WE CAN MOVE ENEMIES TOWARDS THE PLAYER

      const playerPosition = {
        x: canvas.width / 2,
        y: canvas.height / 2,
      };

      const angle = Math.atan2(
        playerPosition.y - enemyPosition.y,
        playerPosition.x - enemyPosition.x
      );

      const speedFactor = getRandomNumberInRange(1, 5);

      const velocity = {
        x: Math.cos(angle) * speedFactor,
        y: Math.sin(angle) * speedFactor,
      };

      const radius = getRandomNumberInRange(30, 50);

      const enemy = new Enemy(
        ctx,
        enemyPosition.x,
        enemyPosition.y,
        radius,
        randomColor("hex"),
        velocity.x,
        velocity.y
      );
      enemies.push(enemy);
    }
  }

  function handleEnemyAndProjectileCollision(
    projectile: Projectile,
    enemy: Enemy,
    indexOfEnemy: number
  ) {
    createExplosionEffect(enemy);
    const currentSize = enemy.radius;
    enemy.color = "white";
    enemy.draw();
    enemy.color = enemy.originalColor;
    enemy.draw();

    projectile.hasHitSomething = true;

    if (currentSize <= 30) {
      enemy.displayDamage(40);

      removeEnemy(indexOfEnemy);
      indexOfEnemy++;
      playerScore += 40;
    } else {
      shrinkEnemy(enemy);
      enemy.displayDamage(20);
      playerScore += 20;
    }
  }

  function detectIfProjectileHitsEnemy(projectile: Projectile) {
    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      if (
        isTwoCirclesColliding(
          projectile.x,
          enemy.x,
          projectile.y,
          enemy.y,
          projectile.radius,
          enemy.radius
        )
      ) {
        handleEnemyAndProjectileCollision(projectile, enemy, i);
      }
    }
  }

  function createExplosionEffect(circle: Circle) {
    if (!ctx) return;
    for (let i = 0; i < 10; i++) {
      explosionCircles.push(
        new MovingCircle(
          ctx,
          circle.x,
          circle.y,
          2,
          circle.color,
          getRandomNumberInRange(-10, 10),
          getRandomNumberInRange(-10, 10)
        )
      );
    }
  }

  function handleEnemyHittingPlayer(player: Circle) {
    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      if (
        isTwoCirclesColliding(
          player.x,
          enemy.x,
          player.y,
          enemy.y,
          player.radius,
          enemy.radius
        )
      ) {
        gameover = true;
        endAnimation();
        break;
      }
    }
  }

  let frameCount = 0;
  let frameCount2 = 0;
  let fps = 0;
  let lastTime = performance.now();

  function startAnimation() {
    function animate() {
      if (!ctx) return;
      const canvas = ctx.canvas;
      animateFrameID = requestAnimationFrame(animate);

      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const player = new Circle(
        ctx,
        canvas.width / 2,
        canvas.height / 2,
        24,
        "#ff0000"
      );

      player.draw();

      for (let i = 0; i < projectiles.length; i++) {
        const projectile = projectiles[i];
        projectile.update();

        detectIfProjectileHitsEnemy(projectile);

        if (projectile.hasHitSomething || projectile.isNotInView) {
          projectiles.splice(i, 1);
          i--;
        }
      }

      for (let i = 0; i < enemies.length; i++) {
        const currentEnemy = enemies[i];
        currentEnemy.update();
      }

      for (let i = 0; i < explosionCircles.length; i++) {
        const circle = explosionCircles[i];
        circle.update();
        if (!circle.isAlive) {
          explosionCircles.splice(i, 1);
        }
      }

      handleEnemyHittingPlayer(player);

      frameCount++;
      frameCount2++;

      const randomNumber = getRandomNumberInRange(30, 200);

      if (frameCount2 % randomNumber === 0) {
        spawnEnemies();
        frameCount2 = 0;
      }

      const currentTime = performance.now();
      const deltaTime = currentTime - lastTime;

      if (deltaTime >= 1000) {
        lastTime = performance.now();
        fps = Math.round((frameCount * 1000) / deltaTime);
        frameCount = 0;
      }

      ctx.fillStyle = "white";
      ctx.font = "14px monospace";
      ctx.fillStyle = "white";
      ctx.fillText(`FPS:${fps}`, 10, 20);
      ctx.fillText(`SCORE: ${playerScore}`, canvas.width - 120, 20);
    }

    animate();
  }

  function endAnimation() {
    cancelAnimationFrame(animateFrameID);
    animating = false;
  }

  function init() {
    enemies.length = 0;
    projectiles.length = 0;
    explosionCircles.length = 0;
    playerScore = 0;
    gameover = false;
    animating = true;
  }

  let openModal = true;

  $: {
    openModal = !animating;
  }

  function start() {
    init();
    startAnimation();
  }

  onMount(() => {
    ctx = canvas.getContext("2d")!;
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    canvas.addEventListener("click", shootProjectile);
  });
</script>

<div>
  <Modal open={openModal} on:close={() => (openModal = false)}>
    <div class="info">
      {#if gameover}
        <p>SCORE: {playerScore}!</p>
        <p style="font-size: 2rem; color: red;">GAMEOVER!</p>
      {/if}
      <div>
        <h2>How to Play</h2>
        {#if !gameover}
          <p>Welcome to the game!</p>
        {/if}
        <p>Your objective is to shoot down the enemies and score points.</p>
        <ul>
          <li>Controls:</li>
          <li>Click to shoot projectiles.</li>
          <li>Avoid colliding with enemies.</li>
        </ul>
      </div>
      <button on:click={start}>PLAY!</button>
    </div>
  </Modal>
  <canvas bind:this={canvas} />
</div>

<style lang="scss" scoped>
  canvas {
    background-color: #000;
  }

  div.info {
    color: #333;
    text-align: center;

    ul {
      margin: 1rem 0;
      li {
        list-style: none;
        &:not(:first-of-type) {
          font-size: 0.875rem;
        }
      }
    }

    button {
      padding: 1rem 3rem;
      background-color: rgba(220, 20, 60, 0.8);
      border: 2px solid rgba(220, 20, 60);
      border-radius: 1rem;
      font-size: 1rem;
      font-weight: 700;
      color: white;
      cursor: pointer;

      &:hover {
        background-color: rgba(220, 20, 60, 0.7);
      }
    }
  }
</style>
