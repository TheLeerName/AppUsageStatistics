var fs = require("fs")
var processWindows = require("node-process-windows");

var ignoredApps = [
	"TextInputHost.exe",
	"explorer.exe"
];
function isAppIgnored(appName)
{
	for (fa of ignoredApps)
		if (fa == appName)
			return true
	return false
}

thecoolcycle();
async function thecoolcycle() {
	for (let i = 0;;i++)
	{
		//console.log(i);
		var activeProcesses = processWindows.getProcesses(function(err, processes) {
			var output = []
			processes.forEach(function (p) {
				if (p.mainWindowTitle.length > 0)
				{
					if (!isAppIgnored(p.processName + ".exe"))
						output.push(p.processName + ".exe")
				}
			});
			saveStat(output);
		});
		await sleep(60000);
	}
}
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

//console.log(output)
//for (th of output)
	//console.log(th[1])

function saveStat(programNames)
{
	if (!fs.existsSync("assets/statistics.save"))
		fs.writeFileSync("assets/statistics.save", "{}")
	var curFile = JSON.parse(fs.readFileSync("assets/statistics.save").toString());

	for (tha of programNames)
	{
		if (Reflect.has(curFile, tha))
		{
			Reflect.get(curFile, tha).push(getDateFormat());
		}
		else
		{
			Reflect.set(curFile, tha, [getDateFormat()]);
		}
	}

	fs.writeFileSync("assets/statistics.save", JSON.stringify(curFile, null, "\t"))
}

function getDateFormat()
{
	// 2012-02-03 07:04:02
	var date = new Date();
	return date.toISOString().substring(0, date.toISOString().lastIndexOf("."));
}

function trueInt(str)
{
	var numbrs = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]
	var str_ = ""
	for (a of str)
		for (b of numbrs)
			if (a == b)
				str_ += a
	return parseInt(str_)
}