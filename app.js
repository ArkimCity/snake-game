export default class {
    constructor($target) {
        this.canvas_width = '400'
        this.canvas_height = '400'

        this.$canvas = document.createElement('canvas')
        this.$canvas.width = this.canvas_width
        this.$canvas.height = this.canvas_height
        $target.appendChild(this.$canvas)
        const context = this.$canvas.getContext('2d');

        this.grid = 16
        this.snake = {
            vx: this.grid,
            vy: 0,
            cells: [{x:100, y: 100}]
        }

        this.render(context)
        this.add_direction()
    }

    render(context) {
        const loop = () => {
            context.clearRect(0,0, parseInt(this.canvas_width), parseInt(this.canvas_height))

            this.snake.cells.push(
                {
                    x: this.snake.cells[this.snake.cells.length - 1].x + this.snake.vx, 
                    y: this.snake.cells[this.snake.cells.length - 1].y + + this.snake.vy
                }
            )

            this.set_apple(context)
            this.draw_snake(context)
            requestAnimationFrame(loop)
        }

        requestAnimationFrame(loop)
    }

    add_direction() {
        document.addEventListener('onKeyDown', (e) => {
            console.log(e);
        })
    }

    draw_snake(context) {

        context.fillStyle = 'white';
        this.snake.cells.forEach(cell => {
            context.fillRect(cell.x, cell.y, this.grid-1, this.grid-1);
        });
    }

    set_apple(context) {
        const apple_x = Math.floor(Math.random() * 400)
        const apple_y = Math.floor(Math.random() * 400)

        context.fillStyle = 'red';
        context.fillRect(apple_x, apple_y, this.grid-1, this.grid-1);
    }

}