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
			show_delays_only: true,
			delay_alert_flash: true
		}
	}
]
````

## Configuration options

The following properties can be configured:

| Option | Description
| ------ | -----------
| `lines` | The lines that you care about.
| `show_delays_only` | Only display updates for lines that have delays
| `delay_alert_flash` | Enabled/Disable slow fade alert for delays
