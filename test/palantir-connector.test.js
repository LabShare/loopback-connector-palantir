'use strict';
const {expect} = require('chai');
describe('Palantir connector tests', () => {
  const ds = global.getDataSource();

  const Project = ds.define('Project', {
        id: {type: String, id: true, palantir: {primaryKey: true, propertyName: 'project_uid'}},
        title: {type: String, palantir: {unique: true, propertyName: 'project'}},
        objectTypeId: {type: String},
        team: {type: String},
        projectId: {type: Number, palantir: {propertyName: 'project_id'}}
      },
      {
        palantir: {
          objectTypeId: process.env.PALANTIR_OBJECT_TYPE
        }
      });

  const testProjects = [{
    title: 'Test-Project-10',
    team: 'TEST',
    projectId: 1234
  }];

  let projectId;

  it('should create objects', async () => {
    const result = await Project.create(testProjects);
    expect(result).to.be.an('array').that.is.not.empty;
    projectId = result[0].id;
    expect(projectId).to.not.be.empty;
  });

  it('should get object back', async () => {
    const expectedResult = Object.assign({}, testProjects[0], {
      id: projectId,
      objectTypeId: process.env.PALANTIR_OBJECT_TYPE
    });
    const result = await Project.findById(projectId);
    expect(result.__data).to.eql(expectedResult);
  });

  it('should delete object', async () => {
    await Project.deleteById(projectId);
    const findObjectResult = await Project.findById(projectId);
    expect(findObjectResult.__data).to.be.empty;
  });

  it('should get objects by simple 1 column where criteria', async () => {
    const findObjectResult = await Project.find({where: {team: 'Bioprinting'}});
    expect(findObjectResult).not.to.be.empty;
  });

  it.only('should get objects by 2 column where criteria', async () => {
    const findObjectResult = await Project.find({
      where: {
        and: [
          {team: 'Bioprinting'},
          {title: '3D-HEAL_Cortical_Profiling-Stemonix'}
        ]
      }
    });
    expect(findObjectResult).not.to.be.empty;
  });
});