/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { act } from 'react-dom/test-utils';

import { API_BASE_PATH } from '../../common/constants';

import { setupEnvironment, pageHelpers } from './helpers';
import { PipelineListTestBed } from './helpers/pipelines_list.helpers';

const { setup } = pageHelpers.pipelinesList;

describe('<PipelinesList />', () => {
  const { server, httpRequestsMockHelpers } = setupEnvironment();
  let testBed: PipelineListTestBed;

  afterAll(() => {
    server.restore();
  });

  describe('With pipelines', () => {
    beforeEach(async () => {
      await act(async () => {
        testBed = await setup();
      });

      testBed.component.update();
    });

    const pipeline1 = {
      name: 'test_pipeline1',
      description: 'test_pipeline1 description',
      processors: [],
    };

    const pipeline2 = {
      name: 'test_pipeline2',
      description: 'test_pipeline2 description',
      processors: [],
    };

    const pipelines = [pipeline1, pipeline2];

    httpRequestsMockHelpers.setLoadPipelinesResponse(pipelines);

    test('should render the list view', async () => {
      const { exists, find, table } = testBed;

      // Verify app title
      expect(exists('appTitle')).toBe(true);
      expect(find('appTitle').text()).toEqual('Ingest Pipelines');

      // Verify documentation link
      expect(exists('documentationLink')).toBe(true);
      expect(find('documentationLink').text()).toBe('Ingest Pipelines docs');

      // Verify create dropdown exists
      expect(exists('createPipelineDropdown')).toBe(true);

      // Verify table content
      const { tableCellsValues } = table.getMetaData('pipelinesTable');
      tableCellsValues.forEach((row, i) => {
        const pipeline = pipelines[i];

        expect(row).toEqual(['', pipeline.name, 'EditDelete']);
      });
    });

    test('should reload the pipeline data', async () => {
      const { actions } = testBed;
      const totalRequests = server.requests.length;

      await actions.clickReloadButton();

      expect(server.requests.length).toBe(totalRequests + 1);
      expect(server.requests[server.requests.length - 1].url).toBe(API_BASE_PATH);
    });

    test('should show the details of a pipeline', async () => {
      const { find, exists, actions } = testBed;

      await actions.clickPipelineAt(0);

      expect(exists('pipelinesTable')).toBe(true);
      expect(exists('pipelineDetails')).toBe(true);
      expect(find('pipelineDetails.title').text()).toBe(pipeline1.name);
    });

    test('should delete a pipeline', async () => {
      const { actions, component } = testBed;
      const { name: pipelineName } = pipeline1;

      httpRequestsMockHelpers.setDeletePipelineResponse({
        itemsDeleted: [pipelineName],
        errors: [],
      });

      actions.clickPipelineAction(pipelineName, 'delete');

      // We need to read the document "body" as the modal is added there and not inside
      // the component DOM tree.
      const modal = document.body.querySelector('[data-test-subj="deletePipelinesConfirmation"]');
      const confirmButton: HTMLButtonElement | null = modal!.querySelector(
        '[data-test-subj="confirmModalConfirmButton"]'
      );

      expect(modal).not.toBe(null);
      expect(modal!.textContent).toContain('Delete pipeline');

      await act(async () => {
        confirmButton!.click();
      });

      component.update();

      const deleteRequest = server.requests[server.requests.length - 2];

      expect(deleteRequest.method).toBe('DELETE');
      expect(deleteRequest.url).toBe(`${API_BASE_PATH}/${pipelineName}`);
      expect(deleteRequest.status).toEqual(200);
    });
  });

  describe('No pipelines', () => {
    test('should display an empty prompt', async () => {
      httpRequestsMockHelpers.setLoadPipelinesResponse([]);

      await act(async () => {
        testBed = await setup();
      });
      const { exists, component, find } = testBed;
      component.update();

      expect(exists('sectionLoading')).toBe(false);
      expect(exists('emptyList')).toBe(true);
      expect(find('emptyList.title').text()).toEqual('Start by creating a pipeline');
    });
  });

  describe('Error handling', () => {
    beforeEach(async () => {
      const error = {
        status: 500,
        error: 'Internal server error',
        message: 'Internal server error',
      };

      httpRequestsMockHelpers.setLoadPipelinesResponse(undefined, { body: error });

      await act(async () => {
        testBed = await setup();
      });

      testBed.component.update();
    });

    test('should render an error message if error fetching pipelines', async () => {
      const { exists, find } = testBed;

      expect(exists('pipelineLoadError')).toBe(true);
      expect(find('pipelineLoadError').text()).toContain('Unable to load pipelines');
    });
  });
});
