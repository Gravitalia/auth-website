const _arrayBufferToBase64 = (buffer: any) => {
	const bytes = new Uint8Array(buffer);
	let binary = "";
	bytes.forEach((byte) => {
		binary += String.fromCharCode(byte);
	});
	return window.btoa(binary);
};

const _stringToArrayBuffer = (str: string) => {
	const encoder = new TextEncoder();
	const uint8Array = encoder.encode(str);
	return uint8Array.buffer;
};

export default function useKeys() {
	const u = useUsers();
	const user = u.userData;

	const generateKey = async () => {
		const publicKeyOptions = {
			challenge: new Uint8Array(32),
			rp: {
				name: "Gravitalia",
				id: "Gravitalia",
			},
			user: {
				id: new Uint8Array(_stringToArrayBuffer(user.id)),
				name: user.id,
				displayName: user.preferredUsername,
			},
			pubKeyCredParams: [
				{ type: "public-key", alg: -7 }, // ECDSA256
				{ type: "public-key", alg: -257 }, // RSA
			],
		} as PublicKeyCredentialCreationOptions;

		const credential = await navigator.credentials.create({
			publicKey: publicKeyOptions,
		}) as PublicKeyCredential;
		const credentialResponse = credential.response as AuthenticatorAttestationResponse;
		const pk = credentialResponse.getPublicKey();

		const base64 = _arrayBufferToBase64(pk);
		const pem =
			`-----BEGIN PUBLIC KEY-----\n` +
			base64?.match(/.{1,64}/g)?.join("\n") +
			`\n-----END PUBLIC KEY-----`;

		// Upload key.
		const id = (await u.updateMe({ pem }))[0];
		user.publicKeys.push({
			id,
			owner: user.id,
			publicKeyPem: pem,
			createdAt: "now",
		});
		useCookie("key", { sameSite: "strict", expires: undefined }).value = id;
		return { pem, id };
	};

	const deleteKey = async (keyId: string) => {
		const id = Number(keyId);
		await u.removeKey(id);
		user.publicKeys.splice(
			user.publicKeys.findIndex((key) => key.id === keyId),
			1,
		);
	};

	return {
		keys: user.publicKeys,
		generateKey,
		deleteKey,
	};
}
