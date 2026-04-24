import { getStore } from '@netlify/blobs';

const SEED = [
  {id:'s1',numero:'58222024000649',nombre:'ARRIETA RAMIREZ CARLOS FRANCISCO',cedula:'204590955',cobertura:'Pago Adelantado BITP',montoAseg:10000000,montoInd:9946334,mes:'ENERO',anno:2025,estado:'Pagada',fechaPres:'2024-12-10',fechaEv:'2024-11-01',fechaPago:'2025-01-15'},
  {id:'s2',numero:'58222024000705',nombre:'SOLANO GAMBOA DANNY',cedula:'108360531',cobertura:'Pago Adelantado BITP',montoAseg:2000000,montoInd:1991953,mes:'ENERO',anno:2025,estado:'Pagada',fechaPres:'2024-12-15',fechaEv:'2024-11-10',fechaPago:'2025-01-20'},
  {id:'s3',numero:'58222024000693',nombre:'GOMEZ MARIN STHEFANY JOHANNA',cedula:'107080001',cobertura:'Muerte Acc. Y Desm (DID)',montoAseg:2000000,montoInd:2000000,mes:'ENERO',anno:2025,estado:'Pagada',fechaPres:'2024-12-12',fechaEv:'2024-11-05',fechaPago:'2025-01-18'},
  {id:'s4',numero:'58222024000707',nombre:'SOLANO CALDERON ALFONSO',cedula:'301590530',cobertura:'Cob. Muerte',montoAseg:2000000,montoInd:2000000,mes:'ENERO',anno:2025,estado:'Pagada',fechaPres:'2024-12-16',fechaEv:'2024-11-12',fechaPago:'2025-01-22'},
  {id:'s5',numero:'58222024000713',nombre:'AGÜERO MORA GEOVANNY',cedula:'105610924',cobertura:'Pago Adelantado BITP',montoAseg:8000000,montoInd:7978545,mes:'ENERO',anno:2025,estado:'Pagada',fechaPres:'2024-12-18',fechaEv:'2024-11-15',fechaPago:'2025-01-25'},
  {id:'s6',numero:'58222025000054',nombre:'VALVERDE BARBOZA RIGOBERTO',cedula:'108520107',cobertura:'Cob. Muerte',montoAseg:6000000,montoInd:5983899,mes:'MARZO',anno:2025,estado:'Pagada',fechaPres:'2025-01-20',fechaEv:'2024-12-10',fechaPago:'2025-03-10'},
  {id:'s7',numero:'58222024000750',nombre:'RAMIREZ ALVARADO ALEXIS',cedula:'203480022',cobertura:'Pago Adelantado BITP',montoAseg:2000000,montoInd:1997321,mes:'MARZO',anno:2025,estado:'Pagada',fechaPres:'2025-01-25',fechaEv:'2024-12-15',fechaPago:'2025-03-15'},
  {id:'s8',numero:'58222025000056',nombre:'CASTRO RUIZ OSCAR',cedula:'107860678',cobertura:'Pago Adelantado BITP',montoAseg:2000000,montoInd:1994637,mes:'MARZO',anno:2025,estado:'Pagada',fechaPres:'2025-01-28',fechaEv:'2024-12-18',fechaPago:'2025-03-18'},
  {id:'s9',numero:'58222025000121',nombre:'GATJENS RAMIREZ EDIE',cedula:'203650708',cobertura:'Pago Adelantado BITP',montoAseg:2000000,montoInd:1997321,mes:'ABRIL',anno:2025,estado:'Pagada',fechaPres:'2025-02-10',fechaEv:'2025-01-05',fechaPago:'2025-04-10'},
  {id:'s10',numero:'58222024000775',nombre:'HERNANDEZ ESPINOZA ISAAC',cedula:'107180738',cobertura:'Pago Adelantado BITP',montoAseg:2000000,montoInd:1997321,mes:'ABRIL',anno:2025,estado:'Pagada',fechaPres:'2025-02-15',fechaEv:'2025-01-10',fechaPago:'2025-04-12'},
  {id:'s11',numero:'58222024000782',nombre:'ORTIZ HERNANDEZ GEOVANNY',cedula:'204170228',cobertura:'Pago Adelantado BITP',montoAseg:6000000,montoInd:6000000,mes:'ABRIL',anno:2025,estado:'Pagada',fechaPres:'2025-02-20',fechaEv:'2025-01-15',fechaPago:'2025-04-15'},
  {id:'s12',numero:'58222025000251',nombre:'VENEGAS MENDEZ GILBERTO',cedula:'502340343',cobertura:'Pago Adelantado BITP',montoAseg:2000000,montoInd:2000000,mes:'MAYO',anno:2025,estado:'Pagada',fechaPres:'2025-03-10',fechaEv:'2025-02-01',fechaPago:'2025-05-08'},
  {id:'s13',numero:'58222025000299',nombre:'UREÑA SANDI MARIBEL',cedula:'107510126',cobertura:'Pago Adelantado BITP',montoAseg:10000000,montoInd:9819962,mes:'JUNIO',anno:2025,estado:'Pagada',fechaPres:'2025-04-05',fechaEv:'2025-03-01',fechaPago:'2025-06-10'},
  {id:'s14',numero:'58222025000298',nombre:'FLORIBETH GAMBOA FERNANDEZ',cedula:'106240782',cobertura:'Pago Adelantado BITP',montoAseg:6000000,montoInd:5891978,mes:'JUNIO',anno:2025,estado:'Pagada',fechaPres:'2025-04-08',fechaEv:'2025-03-05',fechaPago:'2025-06-12'},
  {id:'s15',numero:'58222025000294',nombre:'RAMIREZ PEREZ JOSE ANICETO',cedula:'301730679',cobertura:'Cob. Muerte',montoAseg:4000000,montoInd:3927985,mes:'JUNIO',anno:2025,estado:'Pagada',fechaPres:'2025-04-10',fechaEv:'2025-03-08',fechaPago:'2025-06-15'},
  {id:'s16',numero:'58222025000328',nombre:'ARIAS SALAZAR OLIVIER',cedula:'106390780',cobertura:'Pago Adelantado BITP',montoAseg:2000000,montoInd:1967266,mes:'JULIO',anno:2025,estado:'Pagada',fechaPres:'2025-05-10',fechaEv:'2025-04-01',fechaPago:'2025-07-08'},
  {id:'s17',numero:'58222025000338',nombre:'LIZANO MORA EDDY ALBERTO',cedula:'108580394',cobertura:'Pago Adelantado BITP',montoAseg:2000000,montoInd:1967266,mes:'JULIO',anno:2025,estado:'Pagada',fechaPres:'2025-05-15',fechaEv:'2025-04-05',fechaPago:'2025-07-10'},
  {id:'s18',numero:'58222024000791',nombre:'ZUÑIGA ALPIZAR CARLOS MARTIN',cedula:'106500975',cobertura:'Pago Adelantado BITP',montoAseg:2000000,montoInd:1970539,mes:'JULIO',anno:2025,estado:'Pagada',fechaPres:'2025-05-18',fechaEv:'2025-04-10',fechaPago:'2025-07-12'},
  {id:'s19',numero:'58222025000342',nombre:'ANCHIA BLANCO ELI GERARDO',cedula:'602510088',cobertura:'Pago Adelantado BITP',montoAseg:6000000,montoInd:9852696,mes:'JULIO',anno:2025,estado:'Pagada',fechaPres:'2025-05-20',fechaEv:'2025-04-15',fechaPago:'2025-07-15'},
  {id:'s20',numero:'58222025000344',nombre:'VEGA JARQUIN MANUEL SALVADOR',cedula:'203610987',cobertura:'Cob. Muerte',montoAseg:6000000,montoInd:6000000,mes:'JULIO',anno:2025,estado:'Pagada',fechaPres:'2025-05-22',fechaEv:'2025-04-18',fechaPago:'2025-07-18'},
  {id:'s21',numero:'58222025000311',nombre:'RAMIREZ MORALES JORGE',cedula:'204030085',cobertura:'Cob. Muerte',montoAseg:2000000,montoInd:1970539,mes:'AGOSTO',anno:2025,estado:'Pagada',fechaPres:'2025-06-05',fechaEv:'2025-05-01',fechaPago:'2025-08-10'},
  {id:'s22',numero:'58222025000369',nombre:'ROMERO PAZOS YORDAN',cedula:'203860352',cobertura:'Pago Adelantado BITP',montoAseg:6000000,montoInd:5911620,mes:'AGOSTO',anno:2025,estado:'Pagada',fechaPres:'2025-06-10',fechaEv:'2025-05-05',fechaPago:'2025-08-12'},
  {id:'s23',numero:'58222025000370',nombre:'REYES GUTIERREZ WILLIAM RAMON',cedula:'105850507',cobertura:'Pago Adelantado BITP',montoAseg:2000000,montoInd:1970539,mes:'AGOSTO',anno:2025,estado:'Pagada',fechaPres:'2025-06-12',fechaEv:'2025-05-08',fechaPago:'2025-08-14'},
  {id:'s24',numero:'58222025000375',nombre:'RIVERA ROBLES EMILIO',cedula:'103050182',cobertura:'Cob. Muerte',montoAseg:2000000,montoInd:1973812,mes:'AGOSTO',anno:2025,estado:'Pagada',fechaPres:'2025-06-15',fechaEv:'2025-05-10',fechaPago:'2025-08-16'},
  {id:'s25',numero:'58222025000381',nombre:'GARITA RUBI RAFAEL',cedula:'105790975',cobertura:'Pago Adelantado BITP',montoAseg:4000000,montoInd:3947626,mes:'SEPTIEMBRE',anno:2025,estado:'Pagada',fechaPres:'2025-07-05',fechaEv:'2025-06-01',fechaPago:'2025-09-10'},
  {id:'s26',numero:'58222025000395',nombre:'SANCHEZ SANCHEZ VICTOR MANUEL',cedula:'602250056',cobertura:'Pago Adelantado BITP',montoAseg:2000000,montoInd:1973812,mes:'SEPTIEMBRE',anno:2025,estado:'Pagada',fechaPres:'2025-07-08',fechaEv:'2025-06-05',fechaPago:'2025-09-12'},
  {id:'s27',numero:'58222025000408',nombre:'ANCHIA BLANCO JORGE GERARDO DEL CARMEN',cedula:'106870492',cobertura:'Pago Adelantado BITP',montoAseg:9885430,montoInd:9885430,mes:'SEPTIEMBRE',anno:2025,estado:'Pagada',fechaPres:'2025-07-12',fechaEv:'2025-06-10',fechaPago:'2025-09-15'},
  {id:'s28',numero:'58222025000424',nombre:'RAMIREZ FONSECA JORGE ARTURO',cedula:'900600553',cobertura:'Cob. Muerte',montoAseg:4000000,montoInd:3960720,mes:'OCTUBRE',anno:2025,estado:'Pagada',fechaPres:'2025-08-05',fechaEv:'2025-07-01',fechaPago:'2025-10-10'},
  {id:'s29',numero:'58222025000426',nombre:'GONZALEZ VASQUEZ ROLANDO GERARDO',cedula:'502030657',cobertura:'Pago Adelantado BITP',montoAseg:2000000,montoInd:1980358,mes:'OCTUBRE',anno:2025,estado:'Pagada',fechaPres:'2025-08-08',fechaEv:'2025-07-05',fechaPago:'2025-10-12'},
  {id:'s30',numero:'58222025000435',nombre:'CAMPOS BARRAGAN GERARDO',cedula:'107310302',cobertura:'Pago Adelantado BITP',montoAseg:10000000,montoInd:1901797,mes:'OCTUBRE',anno:2025,estado:'Pagada',fechaPres:'2025-08-10',fechaEv:'2025-07-08',fechaPago:'2025-10-15'},
  {id:'s31',numero:'58222025000450',nombre:'MORERA SANCHEZ MARTIN GENNER',cedula:'106920108',cobertura:'Cob. Muerte',montoAseg:6000000,montoInd:5950904,mes:'NOVIEMBRE',anno:2025,estado:'Pagada',fechaPres:'2025-09-05',fechaEv:'2025-08-01',fechaPago:'2025-11-10'},
  {id:'t1',numero:'58222025000522',nombre:'ENRIQUE AUGUSTO GRANADOS ROBLES',cedula:'105930004',cobertura:'Pago Adelantado BITP',montoAseg:4000000,montoInd:3986908,mes:'FEBRERO',anno:2026,estado:'Pagada',fechaPres:'2026-01-10',fechaEv:'2025-12-01',fechaPago:'2026-02-15'},
  {id:'t2',numero:'58222026000021',nombre:'GIOVANNI ORTIZ BECERRA',cedula:'602180174',cobertura:'Pago Adelantado BITP',montoAseg:6000000,montoInd:6000000,mes:'FEBRERO',anno:2026,estado:'Pagada',fechaPres:'2026-01-12',fechaEv:'2025-12-05',fechaPago:'2026-02-18'},
  {id:'t3',numero:'58222025000543',nombre:'HERNANDEZ AGÜERO ARNULFO MARTIN',cedula:'108130585',cobertura:'Pago Adelantado BITP',montoAseg:6000000,montoInd:5990188,mes:'ABRIL',anno:2026,estado:'Pagada',fechaPres:'2026-01-15',fechaEv:'2025-09-01',fechaPago:'2026-04-10'},
  {id:'p703-1',poliza:'VTM 703',numero:'58222024000734',nombre:'SOLANO CALDERON ALFONSO',cedula:'301590530',cobertura:'Cob. Muerte',montoAseg:400000,montoInd:397909,anno:2025,estado:'Pagada'},
  {id:'p703-2',poliza:'VTM 703',numero:'58222025000055',nombre:'VALVERDE BARBOZA RIGOBERTO',cedula:'108520107',cobertura:'Cob. Muerte',montoAseg:400000,montoInd:398209,anno:2025,estado:'Pagada'},
  {id:'p703-3',poliza:'VTM 703',numero:'58222025000160',nombre:'ZUÑIGA PEREZ GERARDO',cedula:'601780161',cobertura:'Cob. Muerte',montoAseg:400000,montoInd:200000,anno:2025,estado:'Pagada',notas:'Beneficiario: MURILLO MOLINA SANDRA MARIA (cónyuge)'},
  {id:'p703-4',poliza:'VTM 703',numero:'58222025000252',nombre:'MENDEZ MELENDEZ MARVIN',cedula:'601970043',cobertura:'Cob. Muerte',montoAseg:400000,montoInd:200000,anno:2025,estado:'Pagada',notas:'Beneficiaria: RAMIREZ MUÑOZ ANA ISABEL (cónyuge)'},
  {id:'p703-5',poliza:'VTM 703',numero:'58222025000292',nombre:'RAMIREZ PEREZ JOSE ANICETO',cedula:'301730679',cobertura:'Cob. Muerte',montoAseg:400000,montoInd:398809,anno:2025,estado:'Pagada'},
  {id:'p703-6',poliza:'VTM 703',numero:'58222025000345',nombre:'VEGA JARQUIN MANUEL SALVADOR',cedula:'203610987',cobertura:'Cob. Muerte',montoAseg:400000,montoInd:400000,anno:2025,estado:'Pagada'},
  {id:'p703-7',poliza:'VTM 703',numero:'58222025000311',nombre:'RAMIREZ MORALES JORGE',cedula:'204030085',cobertura:'Cob. Muerte',montoAseg:400000,montoInd:399409,anno:2025,estado:'Pagada'},
  {id:'p703-8',poliza:'VTM 703',numero:'58222025000376',nombre:'RIVERA ROBLES EMILIO',cedula:'103050182',cobertura:'Cob. Muerte',montoAseg:400000,montoInd:399709,anno:2025,estado:'Pagada'},
  {id:'p703-9',poliza:'VTM 703',numero:'58222025000410',nombre:'MENDEZ NUÑEZ OTON',cedula:'202140306',cobertura:'Cob. Muerte',montoAseg:400000,montoInd:200000,anno:2025,estado:'Pagada',notas:'Beneficiaria: VENEGAS VALVERDE ANA GERARDA (cónyuge)'},
  {id:'p703-10',poliza:'VTM 703',numero:'58222025000425',nombre:'RAMIREZ FONSECA JORGE ARTURO',cedula:'900600553',cobertura:'Cob. Muerte',montoAseg:400000,montoInd:396382,anno:2025,estado:'Pagada'},
  {id:'p703-11',poliza:'VTM 703',numero:'58222025000447',nombre:'CENTENO HURTADO MARIO ALBERTO',cedula:'502820382',cobertura:'Cob. Muerte',montoAseg:400000,montoInd:0,anno:2025,estado:'En Ajuste',notas:'Beneficiario: CENTENO LARA LUIS MARIO'},
  {id:'p703-12',poliza:'VTM 703',numero:'58222025000466',nombre:'MORERA SANCHEZ MARTIN GENNER',cedula:'106920108',cobertura:'Cob. Muerte',montoAseg:400000,montoInd:396710,anno:2025,estado:'Pagada'},
];

function verifyToken(req) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  const VALID = Netlify.env.get('ACCESS_PIN') || 'VTM805';
  return token === btoa(VALID + ':reclamos');
}

export default async (req) => {
  if (!verifyToken(req)) return new Response('Unauthorized', { status: 401 });

  const store = getStore('reclamos-vtm805');

  if (req.method === 'GET') {
    let claims = await store.get('claims', { type: 'json' });
    if (!claims) {
      claims = SEED;
      await store.set('claims', JSON.stringify(claims));
    }
    return Response.json(claims);
  }

  if (req.method === 'POST') {
    const body = await req.json();
    const claims = (await store.get('claims', { type: 'json' })) || SEED;
    const newClaim = { ...body, id: Date.now().toString() };
    claims.unshift(newClaim);
    await store.set('claims', JSON.stringify(claims));
    return Response.json(newClaim);
  }

  if (req.method === 'PUT') {
    const { id, ...updates } = await req.json();
    const claims = (await store.get('claims', { type: 'json' })) || [];
    const idx = claims.findIndex(c => c.id === id);
    if (idx >= 0) claims[idx] = { ...claims[idx], ...updates };
    await store.set('claims', JSON.stringify(claims));
    return Response.json(claims[idx] || {});
  }

  if (req.method === 'DELETE') {
    const { id } = await req.json();
    let claims = (await store.get('claims', { type: 'json' })) || [];
    claims = claims.filter(c => c.id !== id);
    await store.set('claims', JSON.stringify(claims));
    return Response.json({ ok: true });
  }

  return new Response('Method not allowed', { status: 405 });
};

export const config = { path: '/api/reclamos' };
