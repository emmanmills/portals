import { SynapseConstants } from 'synapse-react-client'
import { HomeExploreConfig, SynapseConfigArray } from 'types/portal-config'
import loadingScreen from '../loadingScreen'
import { GenericCardSchema } from 'synapse-react-client/dist/containers/GenericCard'
import { CardConfiguration } from 'synapse-react-client/dist/containers/CardContainerLogic'
import facetAliases from '../facetAliases'
import { GenerateComponentsFromRowProps } from 'types/portal-util-types'
export const projectsSql =
  "SELECT * FROM syn21994974 WHERE  dhPortalIndex = 'TRUE' and isDHProject = 'TRUE'"
export const projectsEntityId = 'syn21994974'
const entityId = projectsEntityId
const sql = projectsSql
const unitDescription = 'Projects'
const rgbIndex = 1

export const projectSchema: GenericCardSchema = {
  type: SynapseConstants.PROJECT,
  title: 'study',
  description: 'studyDescription',
  secondaryLabels: [
    'diagnosis',
    'intervention',
    'reportedOutcome',
    'deviceType',
    'sensorType',
    'dataCollectionMethod',
    'digitalAssessmentCategory',
    'digitalAssessmentDetails',
    'dataUsed',
    'investigator',
    'keywords',
  ],
}

export const projectsCardConfiguration: CardConfiguration = {
  type: SynapseConstants.GENERIC_CARD,
  genericCardSchema: projectSchema,
  titleLinkConfig: {
    isMarkdown: false,
    matchColumnName: 'study',
    URLColumnName: 'study',
    baseURL: 'Explore/Projects/DetailsPage',
  },
  labelLinkConfig: [
    {
      isMarkdown: false,
      matchColumnName: 'dataUsed',
      URLColumnName: 'id',
      baseURL: 'Explore/Studies/DetailsPage',
    },
  ],
  loadingScreen,
}

export const projects: HomeExploreConfig = {
  homePageSynapseObject: {
    name: 'QueryWrapperFlattened',
    props: {
      rgbIndex,
      unitDescription,
      loadingScreen,
      facet: 'theme',
      link: 'Explore/Projects',
      linkText: 'Explore Projects',
      initQueryRequest: {
        entityId,
        concreteType: 'org.sagebionetworks.repo.model.table.QueryBundleRequest',
        partMask:
          SynapseConstants.BUNDLE_MASK_QUERY_FACETS |
          SynapseConstants.BUNDLE_MASK_QUERY_RESULTS,
        query: {
          sql,
          isConsistent: true,
          limit: 25,
          offset: 0,
        },
      },
    },
  },
  explorePageSynapseObject: {
    name: 'QueryWrapperPlotNav',
    props: {
      rgbIndex,
      entityId,
      cardConfiguration: projectsCardConfiguration,
      sql,
      shouldDeepLink: true,
      name: 'Projects',
      loadingScreen,
      // @ts-ignore
      facetAliases: {
        ...facetAliases,
        studyDescriptionLocation: 'Project Description',
        projectId: 'Study',
      },
      facetsToPlot: [
        'deviceType',
        'diagnosis',
        'digitalAssessmentCategory',
        'intervention',
        'reportedOutcome',
        'resourceType',
        'sensorType',
      ],
    },
  },
}

export const details: GenerateComponentsFromRowProps = {
  sql,
  entityId,
  synapseConfigArray: [
    {
      name: 'Markdown',
      props: {},
      injectMarkdown: false,
      columnName: 'studyDescriptionLocation',
      title: 'Study Description',
    },
  ],
}

export const projectDetailPage: SynapseConfigArray = [
  {
    name: 'CardContainerLogic',
    isOutsideContainer: true,
    props: {
      isHeader: true,
      isAlignToLeftNav: true,
      backgroundColor: '#5bb0b5',
      ...projectsCardConfiguration,
      titleLinkConfig: undefined,
      genericCardSchema: {
        ...projectSchema,
        title: 'study',
        link: 'id',
      },
      sql,
      entityId,
    },
  },
  {
    name: 'GenerateComponentsFromRow',
    props: details,
  },
]