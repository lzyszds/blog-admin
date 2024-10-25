function useResetRefState(initialState) {
  const state = ref({ ...initialState });
  const reset = () => {
    console.log(1234);
    
    state.value = { ...initialState };
  };
  return { state, reset };
}

export default useResetRefState;