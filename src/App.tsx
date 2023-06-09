import * as React from 'react';
import { Button, Box, Link, Typography, Container, Tabs, Tab, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { TariConnection, TariConnectorButton } from 'tari-connector/src/index';
import {
	ResourceAddress,
	Hash,
	TariPermissionNftGetOwnershipProof,
	TariPermissions,
	TariPermissionAccountBalance,
	TariPermissionAccountInfo,
	SubstateAddress,
	NonFungibleIndexAddress,
	NonFungibleAddress,
	NonFungibleAddressContents,
	NonFungibleId,
	U256,
	ComponentAddress,
	TariPermissionTransactionSend,
	TariPermissionTransactionGet
} from "tari-connector/src/tari_permissions";
import { Input } from '@mui/icons-material';

import * as tariswapLib from './tariswap-lib';

export default function App() {
	return (
		<Container maxWidth="sm">
			<Box sx={{ my: 4 }}>
				<Typography variant="h4" component="h1" gutterBottom>
					Tariswap
				</Typography>
				<Connector />
			</Box>
		</Container>
	);
}

function Connector() {
	let signaling_server_address = import.meta.env.VITE_SIGNALING_SERVER_ADDRESS || "http://localhost:9100";

	const [tari, setTari] = React.useState<TariConnection | undefined>();
	const [isConnected, setIsConnected] = React.useState<boolean>(false);
	const [account, setAccount] = React.useState<string | undefined>();

	const onOpen = (tari: TariConnection) => {
		console.log("OnOpen");
		setTari(tari);
		window.tari = tari;
	};
	const setAnswer = async () => {
		console.log("setAnswer");
		tari?.setAnswer();
		await new Promise(f => setTimeout(f, 1000));
		setIsConnected(true);
		console.log("setAnswer 2");
		let res = await tari.sendMessage("accounts.get_default", tari.token);
		console.log("setAnswer 3");
		console.log({ res });
		let component_address = res.account.address.Component;
		console.log({ component_address });
		setAccount(component_address);
	};


	let permissions = new TariPermissions();
	permissions.addPermission(new TariPermissionAccountInfo())
	permissions.addPermission(
		new TariPermissionTransactionSend()
	);
	permissions.addPermission(
		new TariPermissionTransactionGet()
	);

	let optional_permissions = new TariPermissions();



	return (
		<>
			{isConnected
				? <div>
					<Box sx={{ p: 2 }}>
						<Typography variant='p'>
							Using account <b>{account}</b>
						</Typography>
					</Box>


	Hello world!

				</div>
				: <div>
					<TariConnectorButton
						signalingServer={signaling_server_address}
						permissions={permissions}
						optional_permissions={optional_permissions}
						onOpen={onOpen}
					/>
					{tari ? <button onClick={async () => { await setAnswer(); }}>SetAnswer</button> : null}
				</div>
			}


		</>
	);
}
