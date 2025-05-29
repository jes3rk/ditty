import { isClassDefintion } from "./utils";

describe("Utility Function", () => {
  describe("isClassDefinition", () => {
    class NoConstructorClass {}
    class SingleInheritence extends NoConstructorClass {}
    class ConstructorArgs {
      constructor(public readonly hello: string) {}
    }
    function functionWithNoArgs() {
      return "Hello world";
    }
    function functionWithArgs(input: string) {
      return input.length;
    }
    const arrowFunction = () => "Hello world";
    it("should return true for a class definition with no constructor", () => {
      expect(isClassDefintion(NoConstructorClass)).toEqual(true);
    });

    it("should return true for a class with a base class", () => {
      expect(isClassDefintion(SingleInheritence)).toEqual(true);
    });

    it("should return true for a class with constructor args", () => {
      expect(isClassDefintion(ConstructorArgs)).toEqual(true);
    });

    it("should return false for a function with no args", () => {
      expect(isClassDefintion(functionWithNoArgs)).toEqual(false);
    });

    it("should return false for a function with args", () => {
      expect(isClassDefintion(functionWithArgs)).toEqual(false);
    });

    it("should return false for an arrow function", () => {
      expect(isClassDefintion(arrowFunction)).toEqual(false);
    });
  });
});
