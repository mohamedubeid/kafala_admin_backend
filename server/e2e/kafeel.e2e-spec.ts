import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { KafeelDTO } from '../src/service/dto/kafeel.dto';
import { KafeelService } from '../src/service/kafeel.service';

describe('Kafeel Controller', () => {
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
      .overrideProvider(KafeelService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all kafeels ', async () => {
    const getEntities: KafeelDTO[] = (await request(app.getHttpServer()).get('/api/kafeels').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET kafeels by id', async () => {
    const getEntity: KafeelDTO = (
      await request(app.getHttpServer())
        .get('/api/kafeels/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create kafeels', async () => {
    const createdEntity: KafeelDTO = (await request(app.getHttpServer()).post('/api/kafeels').send(entityMock).expect(201)).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update kafeels', async () => {
    const updatedEntity: KafeelDTO = (await request(app.getHttpServer()).put('/api/kafeels').send(entityMock).expect(201)).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update kafeels from id', async () => {
    const updatedEntity: KafeelDTO = (
      await request(app.getHttpServer())
        .put('/api/kafeels/' + entityMock.id)
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE kafeels', async () => {
    const deletedEntity: KafeelDTO = (
      await request(app.getHttpServer())
        .delete('/api/kafeels/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
