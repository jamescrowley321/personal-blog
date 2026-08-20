import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Cloud Architecture & Distributed Systems',
    description: (
      <>
        Notes from the field on designing systems that stay reliable under load —
        event-driven architecture, orchestration, and the trade-offs behind the
        decisions.
      </>
    ),
  },
  {
    title: 'Identity & Authentication',
    description: (
      <>
        Practical write-ups on identity, auth protocols, and the plumbing that
        keeps modern applications secure.
      </>
    ),
  },
  {
    title: 'Built in the Open',
    description: (
      <>
        Deep dives and decision records — including how the research behind these
        posts actually gets done. The source lives on GitHub.
      </>
    ),
  },
];

function Feature({title, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
