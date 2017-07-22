# Module: MMM-MTA
The `MMM-MTA` module is to get the MTA status of subway lines in NYC.

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
