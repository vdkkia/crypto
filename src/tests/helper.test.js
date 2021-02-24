const expect = require("expect");
const helper = require("../core/helpers");

describe("helper.data tests", () => {
  it.only("should return date in right format", async () => {
    let d = new Date();
    d.setMinutes(d.getMinutes() - 23);
    let date = new Date(helper.data.getProcessedDate("23m"));

    expect(date.getFullYear()).toEqual(d.getFullYear());
    expect(date.getMonth()).toEqual(d.getMonth());
    expect(date.getDate()).toEqual(d.getDate());
    expect(date.getHours()).toEqual(d.getHours());
    expect(date.getMinutes()).toEqual(d.getMinutes());

    d = new Date();
    d.setMonth(d.getMonth() - 8);
    date = new Date(helper.data.getProcessedDate("8M"));

    expect(date.getFullYear()).toEqual(d.getFullYear());
    expect(date.getMonth()).toEqual(d.getMonth());
    expect(date.getDate()).toEqual(d.getDate());
    expect(date.getHours()).toEqual(d.getHours());
    expect(date.getMinutes()).toEqual(d.getMinutes());
  });
});
