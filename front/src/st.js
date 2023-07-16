import { ec as EC } from 'elliptic';
import { SHA3 } from 'sha3';

const ec = new EC('p256'); // or 'secp256k1'

const toBytesWithTag = (str) => {
  // Tag: '464c4f572d56302e302d75736572000000000000000000000000000000000000'
  // ref: https://github.com/onflow/flow-go-sdk/blob/9bb50d/sign.go
  const tagBytes = Buffer.alloc(32);
  Buffer.from('FLOW-V0.0-user').copy(tagBytes);
  const strBytes = Buffer.from(str);
  return Buffer.concat([tagBytes, strBytes]);
}

const hashMsg = (msg) => {
  const sha = new SHA3(256);
  return sha.update(toBytesWithTag(msg)).digest();
};

const sign = (privKey, msg) => {
  const key = ec.keyFromPrivate(Buffer.from(privKey, 'hex'));
  const sig = key.sign(hashMsg(msg));
  const n = 32;
  const r = sig.r.toArrayLike(Buffer, 'be', n);
  const s = sig.s.toArrayLike(Buffer, 'be', n);
  return Buffer.concat([r, s]).toString('hex');
};

const toHexStr = (str)=> {
  return Buffer.from(str).toString('hex');
}

// const verifySig = async (pubKey, msg, sig) => {
//   const script = fs.readFileSync(path.join(__dirname, './scripts/verify_sig.cdc'), 'utf8');
//   const response = await fcl.send([
//     fcl.script`${script}`,
//     fcl.args([
//       fcl.arg([pubKey], t.Array(t.String)),
//       fcl.arg(['1.0'], t.Array(t.UFix64)),
//       fcl.arg([sig], t.Array(t.String)),
//       fcl.arg(toHexStr(msg), t.String),
//     ])
//   ]);
//   return await fcl.decode(response);
// }

const main = async () => {
  const pubKey = '7be160dcfc5b4e9044b473fc479c4c5528d71fa2bbd9dc4f740b4a80c749830ed2ee0445f0fa707b4ea888313953b90de8b47fa388302c4268f5fdbc6329754f';
  const privKey = '9a3259d7c18fd98ccf51356a48df5b63d7d544153db49079c46d152ea9739539';
  const msg = 'test message';
  const sig = sign(privKey, msg);
//   const isValid = await verifySig(pubKey, msg, sig);
  console.log({ pubKey, privKey, msg, sig });
};
export default function(){

    main().catch(e => console.error(e));
}
