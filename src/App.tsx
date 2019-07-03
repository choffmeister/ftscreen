import { injectGlobal } from 'emotion'
import * as React from 'react'
import { FullscreenCanvas } from './FullscreenCanvas'

const foo = [
  {
    l: 1,
    m: 1,
  },
  {
    l: 1 / 2,
    m: 1.25,
  },
  {
    l: 1 / 3,
    m: 0.325,
  },
]

const App: React.FunctionComponent = () => {
  const start = React.useRef(performance.now())
  const trace = React.useRef<Array<[number, number]>>([])

  return (
    <FullscreenCanvas
      render={(ctx, canvas) => {
        const t = (performance.now() - start.current) / 1000
        const [cx, cy] = [Math.round(canvas.width) / 2, Math.round(canvas.height / 2)]
        const s = Math.min(cx, cy) / 3

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        ctx.lineWidth = 1
        ctx.strokeStyle = 'white'

        let [x, y] = [cx, cy]
        foo.forEach(f => {
          ctx.beginPath()
          ctx.moveTo(x, y)

          const [dx, dy] = [Math.cos(t * f.m * Math.PI) * f.l * s, Math.sin(t * f.m * Math.PI) * f.l * s]
          ctx.lineTo(x + dx, y + dy)

          ctx.stroke()

          x = x + dx
          y = y + dy
        })
        trace.current = [...trace.current, [x, y]]
        // ctx.lineTo(cx + (Math.random() * 2 - 1) * s, cy + (Math.random() * 2 - 1) * s)

        if (trace.current.length > 0) {
          ctx.lineWidth = 4
          ctx.strokeStyle = 'green'
          ctx.moveTo(trace.current[0][0], trace.current[0][1])
          ctx.beginPath()
          trace.current.slice(1).forEach(p => {
            ctx.lineTo(p[0], p[1])
          })
          ctx.stroke()
        }

        ctx.fillStyle = 'white'
        ctx.textBaseline = 'hanging'
        ctx.fillText(`t = ${t}`, 5, 5)
      }}
    />
  )
}

export default App

// tslint:disable-next-line no-unused-expression
injectGlobal`
  body {
    margin: 0;
    padding: 0;
    padding: constant(safe-area-inset-top) constant(safe-area-inset-right) constant(safe-area-inset-bottom)
        constant(safe-area-inset-left);
    padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
    overflow-x: hidden;
    overflow-y: auto;
    background-color: #2d2d2d;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue',
        sans-serif;
    font-size: 16px;
    color: #333333;

    & * {
      font-family: inherit;
      font-size: inherit;
      -webkit-tap-highlight-color: transparent;
    }
  }

  #app {
    overflow: hidden;
    width: 100vw;
    height: 100vh;
  }
`
