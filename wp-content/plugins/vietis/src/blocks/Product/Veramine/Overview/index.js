import { registerBlockType } from "@wordpress/blocks";
import { InnerBlocks } from "@wordpress/block-editor";
import "./style.scss";
import Edit from "./edit";

registerBlockType("create-block/veramine-overview", {
	title: "Veramine-Overview",
	description: "Example block Veramine overview",
	category: "wedding",
	icon: "dashicons dashicons-info",

	attributes: {
		title: {
			type: "string",
			default: "Features of Products and Services",
		},
		feature: {
			type: "array",
			default: [
				{
					id: 1,
					title: "Data Collection and Monitoring",
					text:
						"Data Quality: Variety. Detailed. Structured. Real Time. Small Traffic. Security-related activities: Process, Registry, System Security, Network, User, SMB, Binaries, AMSI...<br>" +
						"<br>Flexible collection policies: admins can select what data to collect. Adaptive filter: sensors smartly don't send irrelevant high-volume events to servers, that can filter out TB's of traffic sent and processed by sensors and servers.<br>" +
						"<br>External and Insider Threats Prevention with Advanced Monitoring on Data, Devices and Users, such as Key loggers, Video and Screenshot captures, Activities of Browsing-Email-SMB, USB Management Logged Tracking and Access Control Policies (Blocked, Read-Only, or Read-Write), User sessions, User and Entity Behavior Analytics (UEBA)<br>-----",
				},
				{
					id: 2,
					title: "Detection and Deception",
					text:
						"Detect attack tactics and techniques in https://attack.mitre.org/wiki/Technique_Matrix.<br>" +
						"<br>More collected data types allow more data analysis algorithms, combining rule-based and machine learning, resulting in better Detection. Examples: SMB data allows detecting Lateral Movement and Insider Threats; Precise Elevation of Privilege (EOP) detection by collecting security tokens; Lsass process open allows detecting credentials and passwords dumping (Mimikatz); Command arguments allow detecting Malicious Powershell intrusions...<br>" +
						"<br>Deception is an Active Defense approach, whereas most existing approaches are Passive Defense. Platform of Traps, put along the kill chain, to cheat, detect and prevent intrusions. Capable of making every computer (physical or /M) a honeypot, in IT Systems. Uniquely offered by Veramine.<br>" +
						"<br>Deceptive services, processes, files, mutexes, credentials, network listeners, data shares, registry helper, VMs... Track intruders' activities, and limit things they can do, with the traps. E.g. WannaCry checks a mutex to decide if a system is already infected, and we can set such a deceptive mutex.",
				},
				{
					id: 3,
					title: "Incident Response and Forensics",
					text:
						"Yara Search on Memory and Files. Memory dumps are at fingertips. Collected data is searchable using flexible logical expressions. All executable binaries are col ected for forensics.<br>" +
						"<br>Veramine have most Response Actions, from Binaries, Users, Hosts to Processes. E.g. Network Quarantine, Process Suspend/Terminate, User Disable/Disconnect, Host Sleep/Shutdown/Restart, Binary Block, Scan with Virus Total...<br>" +
						"<br>Forensics with Velociraptor to collect various built-in or customized artifacts from multiple endpoints in real-time from centralized portal. VQL, similar to SQL, allows collection tasks to be quickly programmed, automated and shared, so that turn-around from IOC to fu I hunt can be a few minutes. E.g. VQL to search and collect fi es in users' temp directory which have been created within the last week.",
				},
				{
					id: 4,
					title: "Performance, Deployment, Integration and Management",
					text:
						"Veramine sensors on average take less than 1% CPU and 20 MB RAM, network traffic is less than 30 MB/day/host, and can be further tuned using col ection policies. Easy deployment to the whole network such as using AD, SCCM or psexec.<br>" +
						"<br>Integration with S EM, VDI, LDAP, AD, 2-fact Authen, APIs. Sensor Emergency & Autoupdate. Server: Multisite and audited.",
				},
				{
					id: 5,
					title: "Training and Education",
					text:
						"Veramine Founders<br>" +
						'<br> - authored a number of books, such as "Practical Reverse Engineering" best rated on Amazon.com<br>' +
						"<br> - spoke and trained at most respected venues Black Hat, Recon, CCC, NATO...",
				},
			],
		},

		config: {
			type: "object",
			default: {},
		},
	},
	example: {},
	getEditWrapperProps() {
		return { "data-align": "full" };
	},
	edit: Edit,
	save: () => {
		return <InnerBlocks.Content />;
	},
});
