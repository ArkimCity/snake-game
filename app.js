export default class {
    constructor($target) {
        this.canvas_width = '640'
        this.canvas_height = '640'
        this.animationInterval = 50 // ms
        this.init_length = 5

        this.$canvas = document.createElement('canvas')
        this.$canvas.width = this.canvas_width
        this.$canvas.height = this.canvas_height
        this.$score = document.createElement('div')
        this.$score.id = 'score'
        $target.appendChild(this.$score)
        $target.appendChild(this.$canvas)
        const context = this.$canvas.getContext('2d');

        this.cell_size = 16
        this.apple = {x: Math.floor(Math.random() * 40) * 16, y: Math.floor(Math.random() * 40) * 16}
        this.snake = {
            vx: this.cell_size,
            vy: 0,
            cells: [{x:96, y: 96}],
            length: this.init_length
        }

        this.render(context)
        this.add_direction_key()
    }

    render(context) {
        this.draw_apple(context)

        const loop = () => {
            context.clearRect(0,0, parseInt(this.canvas_width), parseInt(this.canvas_height))
            this.$score.innerText = 'ate ' + (this.snake.length - this.init_length) + ' apples'
            
            if (this.move_snake()) {
                return
            }

            this.draw_grid(context)
            this.draw_snake(context)
            this.draw_apple(context)

            setTimeout(() => {
                requestAnimationFrame(loop)
            }, this.animationInterval)
        }

        requestAnimationFrame(loop)
    }

    move_snake() {
        const next_x = this.snake.cells[this.snake.cells.length - 1].x + this.snake.vx
        const next_y = this.snake.cells[this.snake.cells.length - 1].y + + this.snake.vy

        if (this.death_check(next_x, next_y)) {
            alert('Dead')
            location.reload()
            return true
        }

        if (next_x == this.apple.x && next_y == this.apple.y) {
            this.snake.length++

            let apple_position = true

            let apple_next_x = Math.floor(Math.random() * 40) * 16
            let apple_next_y = Math.floor(Math.random() * 40) * 16

            // 다음 사과가 몸통 중간에 생기지 않기 위해
            while (apple_position) {
                let new_apple = true

                apple_next_x = Math.floor(Math.random() * 40) * 16
                apple_next_y = Math.floor(Math.random() * 40) * 16
    
                this.snake.cells.forEach((cell) => {
                    if (cell.x == apple_next_x && cell.y == apple_next_y) {
                        self_death = false
                    }
                })

                if (new_apple) {
                    apple_position = false
                }
            }

            this.apple.x = apple_next_x
            this.apple.y = apple_next_y
        }

        this.snake.cells.push(
            {x: next_x, y: next_y}
        )
        if (this.snake.cells.length > this.snake.length) {
            this.snake.cells.shift()
        }
    }

    draw_grid(context) {
        for (let i = 0; i < this.canvas_height / this.cell_size; i++) {

            context.strokeStyle = 'white';
            context.lineWidth = 0.5;
            context.beginPath();

            context.moveTo(0, i * this.cell_size);
            context.lineTo(this.canvas_height, i * this.cell_size);

            context.moveTo(i * this.cell_size, 0);
            context.lineTo(i * this.cell_size, this.canvas_height);

            context.stroke();
        }
    }

    draw_snake(context) {
        context.fillStyle = 'white';
        this.snake.cells.forEach(cell => {
            context.fillRect(cell.x, cell.y, this.cell_size-1, this.cell_size-1);
        });
    }

    draw_apple(context) {
        context.fillStyle = 'red';
        context.fillRect(this.apple.x, this.apple.y, this.cell_size-1, this.cell_size-1);
    }

    death_check(next_x, next_y) {
        let self_death = false

        if (next_x >= this.canvas_width || next_x < 0 || next_y >= this.canvas_height || next_y < 0) {
            return true
        }

        const check_cells = this.snake.cells.slice(1)
        this.snake.cells.slice(1).forEach((cell) => {
            if (cell.x == next_x && cell.y == next_y) {
                self_death = true
            }
        })

        if (self_death) {
            return true
        }
    }

    add_direction_key() {
        document.addEventListener('keydown', (e) => {
            if (e.key.match('ArrowUp')) {
                // vy == 0 이 아니라 해당 방식으로 해야 하는 이유는, 다음 셀이 생성되기 전에 다시 거꾸로 가는 방향을 입력할 경우를 걸러내기 위해서
                if (this.snake.cells[this.snake.cells.length - 1].y == this.snake.cells[this.snake.cells.length - 2].y) {
                    this.snake.vx = 0
                    this.snake.vy = - this.cell_size
                }
            } else if (e.key.match('ArrowDown')) {
                if (this.snake.cells[this.snake.cells.length - 1].y == this.snake.cells[this.snake.cells.length - 2].y) {
                    this.snake.vx = 0
                    this.snake.vy = this.cell_size
                }
            } else if (e.key.match('ArrowLeft')) {
                if (this.snake.cells[this.snake.cells.length - 1].x == this.snake.cells[this.snake.cells.length - 2].x) {
                    this.snake.vx = - this.cell_size
                    this.snake.vy = 0
                }
            } else if (e.key.match('ArrowRight')) {
                if (this.snake.cells[this.snake.cells.length - 1].x == this.snake.cells[this.snake.cells.length - 2].x) {
                    this.snake.vx = this.cell_size
                    this.snake.vy = 0
                }
            }
        })
    }
}