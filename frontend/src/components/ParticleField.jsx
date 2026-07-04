import React, { useEffect, useRef } from 'react'

const PARTICLE_COUNT = 45
const FOLLOW_RADIUS = 170
const FREE_MAX_SPEED = 0.5
const FOLLOW_MAX_SPEED = 3
const COLORS = ["#ff6a00", "#ff8c1a", "#ffb066"]

// Ambient drifting dots that get pulled toward the cursor when it's over the panel,
// and drift back to a free random wander once the cursor leaves.
const ParticleField = () => {
    const canvasRef = useRef(null)
    const mouseRef = useRef({ x: 0, y: 0, active: false })

    useEffect(()=>{
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        let animationFrame
        let particles = []
        let width = 0
        let height = 0

        const resize = () => {
            const rect = canvas.parentElement.getBoundingClientRect()
            width = rect.width
            height = rect.height
            canvas.width = width
            canvas.height = height
        }

        const createParticles = () => {
            particles = Array.from({length: PARTICLE_COUNT}, ()=> ({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * FREE_MAX_SPEED,
                vy: (Math.random() - 0.5) * FREE_MAX_SPEED,
                size: Math.random() * 2.5 + 1.5,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
            }))
        }

        const handleWindowMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect()
            const insideX = e.clientX >= rect.left && e.clientX <= rect.right
            const insideY = e.clientY >= rect.top && e.clientY <= rect.bottom
            if(insideX && insideY){
                mouseRef.current = {x: e.clientX - rect.left, y: e.clientY - rect.top, active: true}
            }else{
                mouseRef.current.active = false
            }
        }

        const handleWindowMouseLeave = () => {
            mouseRef.current.active = false
        }

        const step = () => {
            ctx.clearRect(0, 0, width, height)
            const mouse = mouseRef.current

            particles.forEach((p)=>{
                let following = false

                if(mouse.active){
                    const dx = mouse.x - p.x
                    const dy = mouse.y - p.y
                    const dist = Math.hypot(dx, dy)
                    if(dist < FOLLOW_RADIUS){
                        following = true
                        const pull = (1 - dist / FOLLOW_RADIUS) * 0.12
                        p.vx += dx * pull * 0.05
                        p.vy += dy * pull * 0.05
                    }
                }

                if(!following){
                    p.vx += (Math.random() - 0.5) * 0.02
                    p.vy += (Math.random() - 0.5) * 0.02
                }

                p.vx *= 0.98
                p.vy *= 0.98

                const speed = Math.hypot(p.vx, p.vy)
                const maxSpeed = following ? FOLLOW_MAX_SPEED : FREE_MAX_SPEED
                if(speed > maxSpeed){
                    p.vx = (p.vx / speed) * maxSpeed
                    p.vy = (p.vy / speed) * maxSpeed
                }

                p.x += p.vx
                p.y += p.vy

                if(p.x < 0 || p.x > width) p.vx *= -1
                if(p.y < 0 || p.y > height) p.vy *= -1
                p.x = Math.max(0, Math.min(width, p.x))
                p.y = Math.max(0, Math.min(height, p.y))

                ctx.globalAlpha = 0.75
                ctx.fillStyle = p.color
                ctx.fillRect(p.x, p.y, p.size, p.size)
            })

            animationFrame = requestAnimationFrame(step)
        }

        resize()
        createParticles()
        step()

        window.addEventListener('resize', resize)
        window.addEventListener('mousemove', handleWindowMouseMove)
        window.addEventListener('mouseleave', handleWindowMouseLeave)

        return () => {
            cancelAnimationFrame(animationFrame)
            window.removeEventListener('resize', resize)
            window.removeEventListener('mousemove', handleWindowMouseMove)
            window.removeEventListener('mouseleave', handleWindowMouseLeave)
        }
    }, [])

    return <canvas ref={canvasRef} className='absolute inset-0 w-full h-full pointer-events-none'/>
}

export default ParticleField
