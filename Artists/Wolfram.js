module.exports = {
  name: 'Wolfram',
  signature: 'montserrat',
  create: (canvas, width, height, end) => {
    var cells = [[]];
    var ruleset = [];

    for (let i = 0; i < 8; i++) {
      ruleset[i] = Math.round(Math.random());
    }

    var cols = Math.round(Math.random() * 250) + 5;
    var size = width / cols;
    var rows = Math.floor(height / size);

    const reset = () => {
      for (let i = 0; i < cols; i++) {
        cells[0][i] = Math.round(Math.random());
      }
    }

    const generate = () => {
      const newCells = [];
      const currCells = cells[cells.length - 1];

      for (let i = 0; i < cols; i++) {
        let prev = ((i + cols) - 1) % cols;
        let curr = i
        let next = (i + 1) % cols;
        newCells[i] = isAlive(
          currCells[prev], currCells[curr], currCells[next]
        );
      }

      cells.push(newCells);
    }

    const isAlive = (a, b, c) => {
      if (a == 1 && b == 1 && c == 1) return ruleset[7];
      if (a == 1 && b == 1 && c == 0) return ruleset[6];
      if (a == 1 && b == 0 && c == 1) return ruleset[5];
      if (a == 1 && b == 0 && c == 0) return ruleset[4];
      if (a == 0 && b == 1 && c == 1) return ruleset[3];
      if (a == 0 && b == 1 && c == 0) return ruleset[2];
      if (a == 0 && b == 0 && c == 1) return ruleset[1];
      if (a == 0 && b == 0 && c == 0) return ruleset[0];
      return 0;
    }

    reset();

    for (let i = 1; i < rows; i++) {
      generate();
    }

    let lens = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        canvas.rect(c * size, r * size, size, size);

        if (cells[r][c] === 1) {
          canvas.fill('black');
        } else {
          canvas.fill('white');
        }
      }

      lens.push(cells[r].length);
    }

    end();
  }
};
