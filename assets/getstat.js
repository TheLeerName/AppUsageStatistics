var fs = require("fs")

if (!fs.existsSync("assets/statistics.save"))
	fs.writeFileSync("assets/statistics.save", "{}")

var curFile = JSON.parse(fs.readFileSync("assets/statistics.save").toString());
var usageArgs = "Usage arguments:\n find \"app_name\"                Get statistic of \"app_name\", ex. find \"steam.exe\"\n top \"count\" filter \"period\"    Get all statistics from 1 to \"count\" apps,\n                                 filtered by period (\"1d\" = 1 day, \"1m\" = 1 month, \"1y\" = 1 year),\n                                 sorted by usage, ex. top \"10\"";

if (process.argv[2] == null)
{
	console.log(usageArgs);
	return
}

switch (process.argv[2])
{
	case "find":
		var curAppName = process.argv[3]
		for (appName of Reflect.ownKeys(curFile))
		{
			if (curAppName == appName)
			{
				var hours = roundNumber((Reflect.get(curFile, curAppName).length - 1) / 60)
				console.log(curAppName + " = " + hours + " hours");
				return;
			}
		}
		console.log("Error: Stat of app " + curAppName + " not found!");
		return;
	case "top":
		var curPeriod = "none";
		if (process.argv[4] == "filter" && process.argv[5] != null)
			curPeriod = process.argv[5];

		var coolarray = [];
		for (appName of Reflect.ownKeys(curFile))
			coolarray.push([appName, valuesInPeriod(Reflect.get(curFile, appName), curPeriod).length]);

		coolarray.sort(function(a, b) {
			return b[1] - a[1];
		});

		var cycleLimit = parseInt(process.argv[3]);
		if ((cycleLimit + "") == "NaN")
			cycleLimit = coolarray.length
		if (cycleLimit < 1)
		{
			console.log("Warning: Count less than 1! Returning top 1 app...\n");
			cycleLimit = 1
		}
		if (cycleLimit > coolarray.length)
		{
			console.log("Warning: Count more than " + coolarray.length + "! Returning top " + coolarray.length + " apps...\n");
			cycleLimit = coolarray.length
		}

		for (let i = 0; i < cycleLimit; i++)
		{
			var hours = roundNumber(parseInt(coolarray[i][1]) / 60)
			console.log((i + 1) + ".  " + coolarray[i][0] + " = " + hours + " hours");
		}
		return;
	default:
		console.log("Error: Unexpected argument! " + arg + "\n\n" + usageArgs);
		return;
}

function valuesInPeriod(array, period)
{
	if (period == "none")
		return array

	var arraytoret = []
	for (th of array)
	{
		var inDate = new Date(th);
		var curDate = new Date();
		if (period.endsWith("d"))
			curDate.setDate(curDate.getDate() - parseInt(period.substring(0, period.indexOf("d"))));
		else if (period.endsWith("m"))
			curDate.setMonth(curDate.getMonth() - parseInt(period.substring(0, period.indexOf("m"))));
		else if (period.endsWith("y"))
			curDate.setFullYear(curDate.getFullYear() - parseInt(period.substring(0, period.indexOf("y"))));
		else
			return []

		if (inDate.getTime() >= curDate.getTime())
			arraytoret.push(th);
	}
	return arraytoret;
}

function roundNumber(float)
{
	var str = float + ""
	if (str.includes("."))
	{
		if (str.substring(str.indexOf(".") + 1, str.length).length > 2)
			str = str.substring(0, str.indexOf(".") + 3)
		if (str.substring(str.indexOf(".") + 1, str.length) == "00" || str.substring(str.indexOf(".") + 1, str.length) == "0")
			return parseInt(str.substring(0, str.indexOf(".")))
		return parseFloat(str)
	}
	else
		return float
}