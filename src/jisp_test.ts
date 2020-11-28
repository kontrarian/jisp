import {
  assert,
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.79.0/testing/asserts.ts"
import { parse, evaluate } from "./jisp.ts"

Deno.test("It parses numbers", () => {
  assertEquals(parse("42"), 42)
})

Deno.test("It parses symbols", () => {
  assertEquals(parse("pi"), "pi")
})

Deno.test("It parses lists", () => {
  assertEquals(parse("(define pi 3.14)"), ["define", "pi", 3.14])
  assertEquals(
    parse("(begin (define pi 3.14) (* 5 pi))"), 
    ["begin", ["define", "pi", 3.14], ["*", 5, "pi"]]
  )
})

Deno.test("It evaluates numbers", () => {
  assertEquals(evaluate(parse("42")), 42)
  assertEquals(evaluate(parse("3.14")), 3.14)
})

Deno.test("It evaluates defined symbols", () => {
  assertEquals(evaluate(parse("pi")), Math.PI)
})

Deno.test("It throws an error when evaluating an undefined symbol", () => {
  assertThrows(() => evaluate(parse("foo")))
})

Deno.test("It evaluates a variable definition", () => {
  assertEquals(evaluate(parse("(begin (define seven 7) seven)")), 7)
})

Deno.test("It evaluates an immediately invoked lambdas", () => {
  assertEquals(evaluate(parse("((lambda () 42))")), 42)
  assertEquals(evaluate(parse("((lambda (x) (* x x)) 5)")), 25)
})

Deno.test("Lambdas can shadow arguments correctly", () => {
  const env = { "x" : 3 }
  assertEquals(evaluate(parse("((lambda (x) x) 7)"), env), 7)
  assertEquals(env["x"], 3)
})

Deno.test("It evaluates only the correct branch of an if statement", () => {
  assertEquals(evaluate(parse("(if (< 0 1) 42 unbound-symbol-error)")), 42)
  assertEquals(evaluate(parse("(if (> 0 1) unbound-symbol-error 42)")), 42)
})

Deno.test("It correctly calculates factorial", () => {
  const source = parse(Deno.readTextFileSync("./examples/factorial.jisp"))
  evaluate(source)

  assertEquals(evaluate(parse('(factorial 1)')), 1)
  assertEquals(evaluate(parse('(factorial 2)')), 1 * 2)
  assertEquals(evaluate(parse('(factorial 3)')), 1 * 2 * 3)
  assertEquals(evaluate(parse('(factorial 4)')), 1 * 2 * 3 * 4)
  assertEquals(evaluate(parse('(factorial 5)')), 1 * 2 * 3 * 4 * 5)
  assertEquals(evaluate(parse('(factorial 6)')), 1 * 2 * 3 * 4 * 5 * 6)
  assertEquals(evaluate(parse('(factorial 7)')), 1 * 2 * 3 * 4 * 5 * 6 * 7)
  assertEquals(evaluate(parse('(factorial 8)')), 1 * 2 * 3 * 4 * 5 * 6 * 7 * 8)
  assertEquals(evaluate(parse('(factorial 9)')), 1 * 2 * 3 * 4 * 5 * 6 * 7 * 8 * 9)
})

Deno.test("It correctly calculates fibonacci", () => {
  const source = parse(Deno.readTextFileSync("./examples/fibonacci.jisp"))
  evaluate(source)

  assertEquals(evaluate(parse('(fibonacci 1)')), 1)
  assertEquals(evaluate(parse('(fibonacci 2)')), 1)
  assertEquals(evaluate(parse('(fibonacci 3)')), 2)
  assertEquals(evaluate(parse('(fibonacci 4)')), 3)
  assertEquals(evaluate(parse('(fibonacci 5)')), 5)
  assertEquals(evaluate(parse('(fibonacci 6)')), 8)
  assertEquals(evaluate(parse('(fibonacci 7)')), 13)
  assertEquals(evaluate(parse('(fibonacci 8)')), 21)
  assertEquals(evaluate(parse('(fibonacci 9)')), 34)
})

Deno.test("correctly calculates the square root with Newtons method", () => {
  const source = Deno.readTextFileSync("./examples/newtons_method.jisp")
  evaluate(parse(`(begin ${source})`))

  function assertCloseTo(x: any, y: any): void {
    assert(Math.abs(x - y) < 0.0001)
  }

  assertCloseTo(evaluate(parse('(sqrt 1)')), Math.sqrt(1))
  assertCloseTo(evaluate(parse('(sqrt 2)')), Math.sqrt(2))
  assertCloseTo(evaluate(parse('(sqrt 3)')), Math.sqrt(3))
  assertCloseTo(evaluate(parse('(sqrt 4)')), Math.sqrt(4))
  assertCloseTo(evaluate(parse('(sqrt 5)')), Math.sqrt(5))
  assertCloseTo(evaluate(parse('(sqrt 6)')), Math.sqrt(6))
  assertCloseTo(evaluate(parse('(sqrt 7)')), Math.sqrt(7))
  assertCloseTo(evaluate(parse('(sqrt 8)')), Math.sqrt(8))
  assertCloseTo(evaluate(parse('(sqrt 9)')), Math.sqrt(9))
})