using DocumentApi.Models;

namespace DocumentApi.Data;

public interface IDocumentRepository
{
    IReadOnlyList<Document> GetAll();
    Document? GetById(int id);
    IReadOnlyList<string> GetCategories();
}
