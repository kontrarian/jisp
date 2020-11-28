type Expr = Function | number | void
type Env = { [operator: string]: Expr }
type Ast = string | number | Ast[]

function plus(...numbers: number[]): number {
  return numbers.reduce((x, y) => x + y)
}

function minus(...numbers: number[]): number {
  return (numbers.length === 1) 
    ? -numbers[0] // unary minus
    : numbers.reduce((x, y) => x - y)
}

function multiply(...numbers: number[]): number {
  return numbers.reduce((x, y) => x * y)
}

function divide(...numbers: number[]): number {
  return numbers.reduce((x, y) => x / y)
}

function lessThan(x: number, y: number): boolean {
  return x < y
}

function lessThanOrEqual(x: number, y: number): boolean {
  return x <= y
}

function greaterThan(x: number, y: number): boolean {
  return x > y
}

function greaterThanOrEqual(x: number, y: number): boolean {
  return x >= y
}

const globalEnvironment: Env = {
  "+" : plus,
  "-" : minus,
  "*" : multiply,
  "/" : divide,
  "<" : lessThan,
  "<=": lessThanOrEqual,
  ">" : greaterThan,
  ">=": greaterThanOrEqual,
  "pi": Math.PI
}

function atom(token: string): string | number {
  const number = parseFloat(token)
  return isNaN(number)
    ? token
    : number
}

function tokenize(source: string): string[] {
  return source
    .replace(/\(/g, " ( ")
    .replace(/\)/g, " ) ")
    .trim()
    .split(/\s+/)
}

function buildAst(tokens: string[]): Ast {
    const token = tokens.shift()
    if (token === "(") {
        const list = []
        while (tokens[0] != ")") {
            list.push(buildAst(tokens))
        }
        tokens.shift() // consume ")"
        return list
    } else if (token === ")") {
        throw new Error("Syntax Error: Unexpected )")
    } else if (token) {
        return atom(token)
    } else {
      throw new Error("Syntax Error: Unexpected end of token stream")
    }
}

function parse(source: string): Ast {
    return buildAst(tokenize(source))
}

function evaluate(expr: Ast, env = globalEnvironment): Expr {
    // Symbol
    if (typeof expr === "string") {
      const variable = env[expr]
      if (variable === undefined) { throw new Error(`Error: Unbound Symbol: ${expr}`)}      
      return env[expr]
    }
    // Number literal
    else if (typeof expr === "number") {
      return expr
    }
    // Begin
    else if (expr[0] === "begin") {
      const [_begin, ...exprs ] = expr

      // evaluate nested expressions and return the last expression value
      return exprs
        .map(expr => evaluate(expr, env))
        .pop()
    } 
    // Define
    else if (expr[0] === "define") {
        const [_define, symbol, value] = expr
        env[symbol as string] = evaluate(value, env)
    } 
    // Lambda
    else if (expr[0] === "lambda") {
        const [_lambda, params, body] = expr

        return function(...args: any[]) {
            // We use prototypical inheritance to implement variable shadowing
            const localEnv = Object.create(env)

            (<Ast[]>params).forEach((param: string, i: number) => {
                // 
                localEnv[param] = args[i]
            })
            return evaluate(body, localEnv)
        }
    }
    // If 
    else if (expr[0] === "if") {
        const [_, test, pass, fail] = expr
        if (evaluate(test, env)) {
            return evaluate(pass, env)
        } else {
            return evaluate(fail, env)
        }
    } 
    // Regular function call
    else {
        const newExp = expr.map((e: any) => evaluate(e, env))
        const [fn, ...args] = newExp
        return (<Function>fn).apply(null, args)
    }
}

export {
  evaluate,
  parse,
}