import dynamic from 'next/dynamic';

// Example of how to use dynamic imports to disable SSR
const DynamicComponent = dynamic(() => import('./SomeComponent'), {
  ssr: false,
  loading: () => <p>Loading...</p>
});

export default DynamicComponent;
