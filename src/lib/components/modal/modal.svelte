<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { tweened } from "svelte/motion";
  import { fade, slide } from "svelte/transition";

  export function teleport(node: Element) {
    let appDiv = document.getElementById("app") as HTMLDivElement;
    appDiv.appendChild(node);

    function destroy() {
      node.remove();
    }

    return {
      destroy,
    };
  }

  export let open: Boolean;
  export let canClose: Boolean = false;
  const dispatch = createEventDispatcher();

  let size = tweened(1, {
    duration: 100,
  });

  async function closeModal() {
    if (canClose) {
      return dispatch("close");
    }
    await size.set(0.98);
    await size.set(1);
    await size.set(0.98);
    await size.set(1);
  }
</script>

{#if open}
  <div use:teleport>
    <div class="modal" transition:fade={{ duration: 320 }}>
      <div
        style="transform: scale({$size});"
        class="modal-content"
        transition:slide={{ duration: 320, delay: 320 }}
      >
        <button class="modal-close-btn" on:click={closeModal}>❌</button>
        <slot />
      </div>
    </div>
  </div>
{/if}

<style>
  .modal {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    background-color: rgba(0, 0, 0, 0.98);
  }

  .modal .modal-content {
    padding: 1rem;
    width: 100%;
    max-width: 600px;
    margin: 0 2rem;
    box-shadow: 0px 5px 1px rgba(0, 0, 0, 0.3);
    border-radius: 0.75rem;
    background-color: white;

    position: relative;
    color: red;
  }

  .modal-close-btn {
    height: 2rem;
    width: 2rem;
    border-radius: 50%;
    outline: none;
    border: 0;
    background-color: white;
    cursor: pointer;
    position: absolute;

    top: -2.25rem;
    right: 0;
  }
</style>
