import db from '../../models';
import { generateResolvers } from '../resolver';

export default generateResolvers('Prompt', ['assessments', 'momentPrompts']);
