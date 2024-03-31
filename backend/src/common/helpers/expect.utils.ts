export const expectCallsInMethods = (methods: (() => jest.Mock)[]) => {
  methods.forEach((method) => {
    expect(method).toHaveBeenCalled();
  });
};

export const expectNoCallsInMethods = (methods: (() => jest.Mock)[]) => {
  methods.forEach((method) => {
    expect(method).not.toHaveBeenCalled();
  });
};
