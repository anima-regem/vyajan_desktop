<script>
  import { library } from '@fortawesome/fontawesome-svg-core';
  import { 
    faBookmark,
    faArchive,
    faBoxArchive,
    faThumbtack,
    faTrash,
    faPlus,
    faArrowLeft,
    faArrowUpRightFromSquare,
    faMagnifyingGlass
  } from '@fortawesome/free-solid-svg-icons';

  // Add icons to library
  library.add(
    faBookmark,
    faArchive,
    faBoxArchive,
    faThumbtack,
    faTrash,
    faPlus,
    faArrowLeft,
    faArrowUpRightFromSquare,
    faMagnifyingGlass
  );

  export let name;
  export let size = 24;
  export let color = 'currentColor';

  const icons = {
    bookmark: faBookmark,
    archive: faArchive,
    unarchive: faBoxArchive,
    pin: faThumbtack,
    unpin: faThumbtack,
    delete: faTrash,
    add: faPlus,
    back: faArrowLeft,
    visit: faArrowUpRightFromSquare,
    search: faMagnifyingGlass
  };

  $: icon = icons[name];
  $: pathData = icon ? icon.icon[4] : '';
  $: viewBox = icon ? `0 0 ${icon.icon[0]} ${icon.icon[1]}` : '0 0 24 24';
</script>

<svg
  {viewBox}
  width={size}
  height={size}
  fill={color}
  xmlns="http://www.w3.org/2000/svg"
  class={$$props.class}
>
  <path d={pathData} />
</svg>
