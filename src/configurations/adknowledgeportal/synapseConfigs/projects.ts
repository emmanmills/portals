import { HomeExploreConfig } from 'types/portal-config'
import { SynapseConstants } from 'synapse-react-client'
import loadingScreen from '../loadingScreen'
import { CardConfiguration } from 'synapse-react-client/dist/containers/CardContainerLogic'
import { projectsSql } from '../resources'

const unitDescription = 'Projects'
const rgbIndex = 4
const facet = 'Program'

export const projectCardConfiguration: CardConfiguration = {
  type: SynapseConstants.GENERIC_CARD,
  loadingScreen,
  genericCardSchema: {
    type: 'Project',
    title: 'Name',
    subTitle: 'Key Investigators',
    description: 'Abstract',
    secondaryLabels: [
      'Institutions',
      'Key Data Contributors',
      'Program',
      'Grant Number',
    ],
  },
  secondaryLabelLimit: 4,
  titleLinkConfig: {
    isMarkdown: false,
    baseURL: 'Explore/Projects/DetailsPage',
    URLColumnName: 'Grant Number',
    matchColumnName: 'Grant Number',
  },
}

const projects: HomeExploreConfig = {
  homePageSynapseObject: {
    name: 'StandaloneQueryWrapper',
    props: {
      unitDescription,
      rgbIndex,
      facet,
      loadingScreen,
      link: 'Explore/Projects',
      linkText: 'Explore Projects',
      sql: projectsSql,
    },
  },
  explorePageSynapseObject: {
    name: 'QueryWrapperPlotNav',
    props: {
      rgbIndex,
      loadingScreen,
      sql: projectsSql,
      shouldDeepLink: true,
      name: 'Projects',
      cardConfiguration: projectCardConfiguration,
      // unitDescription: 'Projects',
    },
  },
}

export default projects
