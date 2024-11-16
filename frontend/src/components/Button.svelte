<script>
  import Icon from './Icon.svelte';
  
  export let type = 'button';
  export let variant = 'primary';
  export let disabled = false;
  export let icon = '';
  export let iconSize = 16;
  export let iconOnly = false;
</script>

<button
  {type}
  {disabled}
  class="btn btn-{variant} {iconOnly ? 'btn-icon' : ''} {$$props.class || ''}"
  on:click
>
  {#if icon}
    <Icon name={icon} size={iconSize} class={!iconOnly && 'mr-2'} />
  {/if}
  <slot />
</button>

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 2.5rem;
    min-width: 2.5rem;
    padding: 0.5rem 1rem;
  }

  .btn-icon {
    padding: 0.5rem;
    aspect-ratio: 1;
  }
</style>
