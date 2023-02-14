import apiFetch from "@wordpress/api-fetch";
import axios from "axios";

export function axiosFetch(data) {
	return axios({
		url: PV_Admin.PV_URL_AJAX,
		method: "POST",
		credentials: "same-origin",
		headers: {
			"Content-Type": "application/json",
		},
		data: data,
	});
}
