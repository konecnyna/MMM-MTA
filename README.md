# Module: MMM-MTA
The `MMM-MTA` module is to get the MTA status of subway lines in NYC.

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:

````javascript
modules: [
	{
		module: "MMM-MTA",
		position: "top_right",
		header: "MTA",
		config: {
			lines: ['123', 'BDFM', 'JZ'],
			showDelaysOnly: true,
			delayAlertFlash: true,
			fetchInterval: 60000
		}
	}
]
````

## Configuration options

The following properties can be configured:

| Option | Description
| ------ | -----------
| `lines` | The lines that you care about.
| `showDelaysOnly` | Only display updates for lines that have delays
| `delayAlertFlash` | Enabled/Disable slow fade alert for delays
| `fetchInterval` | Check train status interval. Default is 5 minutes;
