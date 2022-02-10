// Toggle input type depending on if the user wants to search via film name or ID
export function toggleSearchType() {
	var radios = document.querySelectorAll('input[type=radio][name="searchValue"]');
	var field = document.getElementById('search');

	radios.forEach((radio) =>
		radio.addEventListener('change', () => {
			field.setAttribute('name', radio.value);
			field.value = '';
		})
	);
}

export async function injectError(error) {
	const result = `<div class="toast fade show">
						<div class="toast-header bg-danger text-white">
							<strong class="me-auto">Error</strong>
							<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
						</div>
						<div class="toast-body">${error}</div>
					</div>`;
	await injectHtml('toast-container', result);
}

export async function injectSuccess(success) {
	const result = `<div class="toast fade show">
						<div class="toast-header bg-success text-white justify-content-end">
							<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
						</div>
						<div class="toast-body">${success}</div>
					</div>`;
	await injectHtml('toast-container', result);
}

async function injectHtml(container, html) {
	try {
		await injectHtmlIntoEntity(document.getElementById(container), html);

		return true;
	} catch (ex) {
		console.error(ex);
		return false;
	}
}

async function injectHtmlIntoEntity(containerEntity, html) {
	try {
		// Inject HTML into DOM.
		containerEntity.insertAdjacentHTML('beforeend', html);
		return true;
	} catch (ex) {
		console.error(ex);
		return false;
	}
}
