import { readdirSync } from 'fs';
import DB from '../models';
import markdownToToJson from 'markdown-to-json';

const files = readdirSync(`${__dirname}/content`);

export async function importContent() {
  const filesPath = files.map((fileName) => {
    return `runbooks/content/${fileName}`;
  });
  const filesContent = markdownToToJson.parse(filesPath, {
    width: '',
    content: '',
  });
  const filesContentArr = Object.values(JSON.parse(filesContent));

  filesContentArr.forEach((file: any, i) => {
    file.preview = '';
    file.type = 'podcast';
    file.source = file.source || 'Medical Journal';
    if (!file.tags) {
      file.tags = [];
    }
    delete file.basename;
  });

  for (const _a of filesContentArr) {
    try {
      await DB.Content.create(_a);
    } catch (e) {
      console.log(`e`, e);
    }
  }
}

const run = async () => {
  await importContent();

  process.exit(0);
};

//Run primary function
//Note:  will probably hang and not return unless process.exit called
// run();

// must export something for isolated modules
export default run;
