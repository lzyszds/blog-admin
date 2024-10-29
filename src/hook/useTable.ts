export function useTableScroll(scrollX: MaybeRef<number> = 702) {
  const tableWrapperRef = shallowRef<HTMLElement | null>(null);
  const { height: wrapperElHeight } = useElementSize(tableWrapperRef);

  const scrollConfig = computed(() => {
    return {
      y: wrapperElHeight.value,
      x: toValue(scrollX)
    };
  });

  return {
    tableWrapperRef,
    scrollConfig
  };
}