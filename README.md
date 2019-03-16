# Disposable Art

A little project that creates generative art then prints it on a receipt printer.
The very nature of this art is that it isn't value because its produced cheaply on
receipt paper, but in actual fact these are potentially once in a lifetime art works.

## Being an artist
Submit a pull request adding a file into the `/Artists` folder.

The export must have 3 things:

- A name (max length 50 characters)
- A signature font (See **Available fonts** below)
- A create function (See **Create** below)

### Create
A function that has 4 parameters passed to it:

- **canvas** _The PDFkit document that you do the work onto_
- **width** _The width of the design area_
- **height** _The height of the design area_
- **end** _The resolve function for setting the work as done_

Because the create function has this end function, it allows you to create work
asynchronously, possibly requiring an external API etc.

Template:
```
module.exports = {
  name: 'Warhol',
  signature: 'sacramento|dancing|montserrat'
  create: (canvas, width, height, end) => {
    end();
  }
}
```

### Available fonts (for signatures)

- **dancing** [Dancing Script](https://fonts.google.com/specimen/Dancing+Script)
- **sacramento** [Sacramento](https://fonts.google.com/specimen/Sacramento)
- **montserrat** [Montserrat](https://fonts.google.com/specimen/Montserrat)

## Developing an artist file

Run `npm run workshop` and open http://localhost:3000. From here you can see a sort of live reloading view of your artist file.
