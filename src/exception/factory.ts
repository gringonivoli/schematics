import { join, normalize, Path, strings } from '@angular-devkit/core';
import { apply, mergeWith, move, Rule, Source, template, url } from '@angular-devkit/schematics';
import { Location, NameParser } from '../utils/name.parser';
import { ExceptionOptions } from './schema';

export function main(options: ExceptionOptions): Rule {
  options = transform(options);
  return mergeWith(generate(options));
}

function transform(options: ExceptionOptions): ExceptionOptions {
  const target: ExceptionOptions = Object.assign({}, options);
  target.path = target.path !== undefined ? join(normalize('src'), target.path) : normalize('src');
  const location: Location = new NameParser().parse(target);
  target.name = strings.dasherize(location.name);
  target.path = strings.dasherize(location.path);
  target.language = target.language ? target.language : 'ts';
  return target;
}

function generate(options: ExceptionOptions): Source {
  return apply(
    url(join('files' as Path, options.language)), [
      template({
        ...strings,
        ...options
      }),
      move(join(options.path as Path, options.name))
    ]
  );
}
