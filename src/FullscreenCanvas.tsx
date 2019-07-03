import * as React from 'react'

interface Props {
  render: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void
}

export const FullscreenCanvas: React.FunctionComponent<Props> = ({ render }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  React.useLayoutEffect(() => {
    if (canvasRef.current) {
      let animationFrameId = 0
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')!

      const handler = () => {
        if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
          canvas.width = window.innerWidth
          canvas.height = window.innerHeight
        }
        render(ctx, canvas)
        animationFrameId = window.requestAnimationFrame(handler)
      }
      handler()
      return () => window.cancelAnimationFrame(animationFrameId)
    } else {
      return () => {}
    }
  }, [canvasRef])

  return <canvas ref={canvasRef} />
}
