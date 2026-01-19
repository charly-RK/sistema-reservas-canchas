
import axios, { AxiosResponse } from 'axios';

const API_URL = 'http://localhost:3000';
const CONCURRENT_USERS = 20;

interface RequestResult {
    status: number;
    time?: number;
    error?: string;
}

async function runLoadTest() {
    console.log(` Iniciando prueba de carga con ${CONCURRENT_USERS} usuarios concurrentes...`);

    const startTime = Date.now();
    const requests: Promise<RequestResult>[] = [];

    for (let i = 0; i < CONCURRENT_USERS; i++) {
        requests.push(
            axios.get(`${API_URL}/canchas`)
                .then((res: AxiosResponse) => ({ status: res.status, time: Date.now() - startTime }))
                .catch((err: any) => ({ status: err.response?.status || 500, error: err.message }))
        );
    }

    try {
        const results = await Promise.all(requests);
        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000;

        const successCount = results.filter((r: RequestResult) => r.status === 200).length;
        const failCount = results.length - successCount;

        console.log('\n Resultados de la Prueba de Rendimiento:');
        console.log('----------------------------------------');
        console.log(`Tiempo total: ${duration} segundos`);
        console.log(`Peticiones exitosas: ${successCount}`);
        console.log(`Peticiones fallidas: ${failCount}`);
        console.log(`Rendimiento: ${(results.length / duration).toFixed(2)} req/s`);
        console.log('----------------------------------------');

        if (failCount === 0) {
            console.log(' Prueba de carga PASÓ exitosamente.');
        } else {
            console.log(' Hubo fallos en la prueba de carga.');
        }

    } catch (error) {
        console.error('Error fatal en la prueba:', error);
    }
}

runLoadTest();
