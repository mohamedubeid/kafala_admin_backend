import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { ChildDTO } from '../src/service/dto/child.dto';
import { ChildService } from '../src/service/child.service';

describe('Child Controller', () => {
  let app: INestApplication;

  const authGuardMock = { canActivate: (): any => true };
  const rolesGuardMock = { canActivate: (): any => true };
  const entityMock: any = {
    id: 'entityId',
  };

  const serviceMock = {
    findById: (): any => entityMock,
    findAndCount: (): any => [entityMock, 0],
    save: (): any => entityMock,
    update: (): any => entityMock,
    deleteById: (): any => entityMock,
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard)
      .useValue(authGuardMock)
      .overrideGuard(RolesGuard)
      .useValue(rolesGuardMock)
      .overrideProvider(ChildService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all children ', async () => {
    const getEntities: ChildDTO[] = (await request(app.getHttpServer()).get('/api/children').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET children by id', async () => {
    const getEntity: ChildDTO = (
      await request(app.getHttpServer())
        .get('/api/children/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create children', async () => {
    const createdEntity: ChildDTO = (await request(app.getHttpServer()).post('/api/children').send(entityMock).expect(201)).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update children', async () => {
    const updatedEntity: ChildDTO = (await request(app.getHttpServer()).put('/api/children').send(entityMock).expect(201)).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update children from id', async () => {
    const updatedEntity: ChildDTO = (
      await request(app.getHttpServer())
        .put('/api/children/' + entityMock.id)
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE children', async () => {
    const deletedEntity: ChildDTO = (
      await request(app.getHttpServer())
        .delete('/api/children/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
