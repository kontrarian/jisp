# JISP 

A minimal Just For Fun™ Scheme interpreter in Typescript using [Deno](https://deno.land/) .

See `jisp_test.ts` for basic usage. Run tests with `deno test --allow-read` 

## Some Runnable Programs

```scheme
(define factorial
  (lambda (n)
    (if (<= n 1)
      n
      (* n (factorial (- n 1))))))
```

```scheme
(define fibonacci 
  (lambda (n)
    (if (<= n 2)
      1
      (+ (fibonacci (- n 1)) 
         (fibonacci (- n 2))))))
```

```scheme
(define abs
  (lambda (x)
    (if (< x 0)
      (- x)
      x)))
  
(define average
  (lambda (x y)
    (/ (+ x y) 2.0)))
  
(define square
  (lambda (x)
    (* x x)))
  
(define good-enough?
  (lambda (x guess)
    (< (abs (- (square guess) x))
       0.001)))
  
(define improve
  (lambda (x guess)
    (average guess (/ x guess))))
  
(define sqrt-iter
  (lambda (x guess)
    (if (good-enough? x guess)
      guess
      (sqrt-iter x (improve x guess)))))
  
(define sqrt
  (lambda (x)
    (sqrt-iter x 1)))
```

## TODO

* Add file runner that can be installed with `deno install`
* Add command line repl
* Add browser repl
