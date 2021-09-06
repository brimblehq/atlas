import { responseData } from "../index";
it("should return an object containing {status: 200}", () => {
  expect(responseData("OK", false, 200)).toEqual(
    expect.objectContaining({ status: 200 })
  );
});
