function useResetRefState(initialState) {
  const state = ref({ ...initialState });
  const reset = () => {
    state.value = { ...initialState };
  };
  return { state, reset };
}

export default useResetRefState;