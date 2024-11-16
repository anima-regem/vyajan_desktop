<script>
  export let size = 48;
</script>

<div class="flex items-center gap-3">
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 48 48" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    class="text-accent-500"
  >
    <path 
      d="M24 4L6 12V22C6 31.1 13.4 39.6 24 42C34.6 39.6 42 31.1 42 22V12L24 4Z" 
      fill="currentColor"
      opacity="0.2"
    />
    <path 
      d="M24 4L6 12V22C6 31.1 13.4 39.6 24 42C34.6 39.6 42 31.1 42 22V12L24 4ZM40 22C40 30.3 33.4 37.9 24 40.2C14.6 37.9 8 30.3 8 22V13.1L24 6.1L40 13.1V22Z" 
      fill="currentColor"
    />
    <path 
      d="M24 20L18 26V34L24 31L30 34V26L24 20Z" 
      fill="currentColor"
    />
  </svg>
  <span class="text-{size/1.5}xl font-bold bg-gradient-to-r from-accent-400 to-accent-500 text-transparent bg-clip-text">
    Vyajan
  </span>
</div>
