import React from 'react';
import dynamic from 'next/dynamic';
import('jodit/build/jodit.min.css');

const JoditEditorReact = dynamic(import('jodit-react'), { ssr: false });

export const JoditEditor = ({ value, onChange, config }) => {
  return <JoditEditorReact value={value} config={config} onChange={onChange} />;
};