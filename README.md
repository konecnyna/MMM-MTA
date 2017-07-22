# Module: Hello World
The `helloworld` module is one of the default modules of the MagicMirror. It is a simple way to display a static text on the mirror.
## Using the module

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
modules: [
	{
		module: "MMM-MTA",
		position: "bottom_bar",	// This can be any of the regions.
		config: {
			lines: ["BDFM", "7"]
		}
	}
]
````

## Configuration options

The following properties can be configured:

| Option | Description
| ------ | -----------
| `lines` | The lines that you care about.
