/** @param {NS} ns */
export class Job {
	
	constructor (target, action, threads) {
		this.target = target;
		this.action = action;
		this.threads = threads;
	}
}

export class HackJob extends Job {
	constructor (target, threads) {
		super(target, threads);
		this.action = 'h';
	}
}

export class WeakenJob extends Job {
	constructor (target, threads) {
		super(target, threads);
		this.action = 'w';
	}
}

export class GrowJob extends Job {
	constructor (target, threads) {
		super(target, threads);
		this.action = 'g';
	}
}

export class JobList {
	constructor () {
		var jobs = [];
	}
	addJob(Job) {
		this.jobs.push(job)
	}
	getHackJobs() {
		jobs.forEach(job => { 
			var output
			if(this.action = 'h') {
				output.push(job)
			}
			return output;
		});
	}
}
