import { viteJsonPlugin } from 'rolldown/experimental';
import { expect, test } from 'vitest';

const plugin = viteJsonPlugin({ minify: false }) as unknown as {
  transform: Function | { handler: Function };
};
const transform =
  typeof plugin.transform === 'function' ? plugin.transform : plugin.transform.handler;

test('transform returns the sourcemap as a plain object', async () => {
  const result = await transform('{ "foo": "bar" }', '/data.json', { moduleType: 'json' });

  expect(result.code).toContain('foo');
  // An empty map must stay recognizable as `{ mappings: '' }` to callers like Vite's dev server.
  expect(result.map).not.toHaveProperty('inner');
  expect(result.map).toMatchObject({ mappings: '' });
});
