import fs from 'fs';
import { parse } from 'csv-parse';
import { dirname } from 'path';



const fileInput = 'PatreonListExport.csv';


fs.readFile(fileInput, 'utf8', parseCSV);


function parseCSV(err, data) {
	if(err) {
		console.log("ERROR: " + err);
		return; // exit 1
	}
	parse(data, {}, makeJSON);
}

function makeJSON(err, records)
{
	if(err) {
		console.log("ERROR: " + err);
		return; // exit 2
	}
	
	var namesDisplay = {};
	var namesAccess = {};
	
	records.forEach((e)=>{
		
		if(e[0].length > 0) {
			let pDisp = parseValue(e[0]);
			if(pDisp != null) {
				let key = 't' + pDisp[1];
				if(!namesDisplay[key]) {
					namesDisplay[key] = [];
				}
				namesDisplay[key].push(pDisp[0]);
			}
		}
		
		if(e[1].length > 0) {
			let pAcc = parseValue(e[1]);
			if(pAcc != null) {
				let key = 't' + pAcc[1];
				if(!namesAccess[key]) {
					namesAccess[key] = [];
				}
				namesAccess[key].push(pAcc[0]);
			}
		}
		
		
	});
	
	let finalData = {
		'namesDisplay': namesDisplay,
		'namesAccess': namesAccess
	};
	
	fs.writeFile(dirname(fileInput) + '/output.json', JSON.stringify(finalData), 'utf8', ()=>{});
	
	console.log(finalData);
}

function parseValue(str)
{
	let val = str.match(/^(.+)(\\t)(\d+)$/);
	if(val == null || val.length != 4) {
		return null;
	}
	return [val[1], val[3]];
}