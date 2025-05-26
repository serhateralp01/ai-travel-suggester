import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    // @ts-ignore
    const env = loadEnv(mode, process.cwd(), '');
    return {
        define: {
            // @ts-ignore
            'process.env.OPENAI_API_KEY': JSON.stringify(env.OPENAI_API_KEY),
        },
        plugins: [react()],
    };
});
