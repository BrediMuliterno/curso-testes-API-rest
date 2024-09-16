import { describe, expect } from '@jest/globals';
import bcryptjs from 'bcryptjs';
import AuthService from '../../services/authService.js';
import Usuario from '../../models/usuario.js';

const authService = new AuthService();

describe('Testando a authService.cadastrarUsuario', () => {
  it('O usuário deve possuir um nome, email e senha', async () => {
    // arrage
    const usuarioMock = {
      nome: 'Sergio',
      email: 'sergio@teste.com.br',
    };
    // act
    const usuarioSalvo = authService.cadastrarUsuario(usuarioMock);
    // assert
    await expect(usuarioSalvo).rejects.toThrowError('A senha de usuário é obrigatório!');
  });

  it('A senha do usuário precisa ser criptografada quando for salva no banco de dados', async () => {
    // arrage
    const usuarioMock = {
      nome: 'Sergio',
      email: 'sergio4@teste.com.br',
      senha: 'senha123',
    };
    // act
    const resultado = await authService.cadastrarUsuario(usuarioMock);
    const senhaIguais = await bcryptjs.compare('senha123', resultado.content.senha);
    // assert
    expect(senhaIguais).toStrictEqual(true);
    await Usuario.excluir(resultado.content.id);
  });

  it('Não pode ser cadastrado um usuário com e-mail duplicado', async () => {
    // arrage
    const usuarioMock = {
      nome: 'Sergio',
      email: 'teste@gmail.com',
      senha: 'senha123',
    };
      // act
    const usuarioSalvo = authService.cadastrarUsuario(usuarioMock);
    // assert
    await expect(usuarioSalvo).rejects.toThrowError('O email já esta cadastrado!');
  });

  it('Ao cadastrar um usuário, deve ser retornado mensagem informando que o usuário foi cadastrado', async () => {
    // arrage
    const usuarioMock = {
      nome: 'Sergio',
      email: 'sergio2@teste.com.br',
      senha: 'senha123',
    };
      // act
    const resultado = await authService.cadastrarUsuario(usuarioMock);
    // assert
    expect(resultado.message).toEqual('usuario criado');
    await Usuario.excluir(resultado.content.id);
  });

  it('Ao cadastrar um usuário, validar retorno do usuário', async () => {
    // arrage
    const usuarioMock = {
      nome: 'Sergio',
      email: 'sergio3@teste.com.br',
      senha: 'senha123',
    };
    // act
    const resultado = await authService.cadastrarUsuario(usuarioMock);
    // assert
    expect(resultado.content).toMatchObject(usuarioMock);
    await Usuario.excluir(resultado.content.id);
  });
});
